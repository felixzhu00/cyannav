import React, { useState, useEffect, useContext, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Box,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Paper,
    Button,
    IconButton,
    TextField,
    Tabs,
    Tab,
    useTheme,
} from "@mui/material";
import {
    Undo,
    Redo,
    Delete,
    ExpandMore,
    KeyboardArrowDown,
    ThumbUp,
    ThumbDown,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

import MUIExportMapModal from "./modals/MUIExportMapModal";
import MUIPublishMapModal from "./modals/MUIPublishMapModal";
import MUIAddFieldModal from "./modals/MUIAddFieldModal";
import MUICommentModal from "./modals/MUICommentModal";
import { MuiColorInput } from "mui-color-input";

import NavJSON from "./NavJSON";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";
import * as turf from "@turf/turf";

function MapViewingPage() {
    const theme = useTheme();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { id } = useParams();
    const [value, setValue] = useState("1");

    const [currentModel, setCurrentModel] = useState("");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [anchorElChoropleth, setAnchorElChoropleth] = useState(null);

    const [features, setFeatures] = useState([]);

    const [comments, setComments] = useState([]);

    /**
     * Like/Dislikes constants and states
     */
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);

    /**
     * Map published status state
     */
    const [isPublished, setIsPublished] = useState(false);

    //trigger if textfield is unfocused
    const [focusedField, setFocusedField] = useState(null);
    const focusedFieldRef = useRef(null);

    // Redirect
    const navigate = useNavigate();

    //Runs on initial load
    useEffect(() => {
        if (id != null) {
            store.getMapById(id);
            store.getGeojson(id);
            store.setCurrentArea(-1);
            store.setByFeature(null);
        }
    }, [id]);

    useEffect(() => {
        if (store.currentMap == "Unauthorized") {
            alert("You do not permission to access this map")
            navigate("/browsepage")
            return
        }
        if (store.currentMap == "Notfound") {
            alert("Map not found")
            navigate("/browsepage")
            return
        }

        if (store.currentMap != null) {
            setIsPublished(store.currentMap.published);
            if (auth.user && auth.user.userId) {
                setHasLiked(store.currentMap.like.includes(auth.user.userId));
                setHasDisliked(store.currentMap.dislike.includes(auth.user.userId));    
            }
        }

        if (store.currentMap && store.currentMap.commentsId) {
            const fetchComments = async () => {
                const commentsPromises = store.currentMap.commentsId.map(
                    (commentId) => store.getCommentById(commentId)
                );
                try {
                    const commentsResponses = await Promise.all(
                        commentsPromises
                    );
                    const fetchedComments = commentsResponses.map(
                        (response) => ({
                            ...response,
                            hasLikedComment: response.upvotes.includes(
                                (auth.user && auth.user.userId) ? auth.user.userId : "####"
                            ),
                            hasDislikedComment: response.downvotes.includes(
                                (auth.user && auth.user.userId) ? auth.user.userId : "####"
                            ),
                        })
                    );
                    setComments(fetchedComments);
                } catch (error) {
                    console.error("Error fetching comments:", error);
                }
            };
            fetchComments();
        }
    }, [store.currentMap]);

    useEffect(() => {
        if (store.geojson && store.geojson.features) {
            const updatedFeatures = store.geojson.features.map((feature) => {
                const originalFields = { ...feature.fields };

                //Set name field if name doesnt exist
                if (originalFields.name === undefined) {
                    originalFields.name = feature.properties.admin;
                }

                //Set center if center doesnt exist
                if (
                    originalFields.center_longitude === undefined &&
                    originalFields.center_latitude === undefined
                ) {
                    const coordinates =
                        turf.centerOfMass(feature).geometry.coordinates;
                    const roundedCoordinates = coordinates.map((coord) =>
                        parseFloat(coord).toFixed(3)
                    );
                    const [lng, lat] = roundedCoordinates;
                    originalFields.center_longitude = String(lng);
                    originalFields.center_latitude = String(lat);
                }

                // Add required radius field for heatmap and pointmap
                if (
                    originalFields.radius === undefined &&
                    (store.currentMap.mapType === "heatmap" ||
                        store.currentMap.mapType === "pointmap")
                ) {
                    originalFields.radius = 0;
                }

                // Add required scale field for distributiveflowmap
                if (
                    originalFields.scale === undefined &&
                    store.currentMap.mapType === "distributiveflowmap"
                ) {
                    originalFields.scale = 0;
                }

                return {
                    ...feature,
                    fields: originalFields,
                };
            });
            setFeatures(updatedFeatures);

            //Sets the exisitng map by feature if it exist
            if (
                store.geojson.features[0].fields &&
                store.geojson.features[0].fields._byFeature
            ) {
                const currentFeature =
                    store.geojson.features[0].fields._byFeature;
                if (
                    store.geojson.features[0].fields.hasOwnProperty(
                        currentFeature
                    )
                ) {
                    store.setByFeature(
                        store.geojson.features[0].fields._byFeature
                    );
                }
            }
        }
    }, [store.geojson]);

    useEffect(() => {
        // Compare current focusedField with the previous one
        console.log(features);
        if (
            features.length !== 0 &&
            focusedFieldRef.current !== focusedField &&
            !areFeaturesEqual(features, store.geojson.features)
        ) {
            store.setGeoJsonFeatures(features);
        }
        focusedFieldRef.current = focusedField;
        setFocusedField(null);
    }, [focusedField, features]);

    // // Used for Indexing currentArea Feature in geojson array
    // useEffect(() => {
    //   console.log("current",store.currentArea)
    // }, [store.currentArea]);

    const areFeaturesEqual = (featuresA, featuresB) => {
        if (featuresA.length !== featuresB.length) {
            return false;
        }

        for (let i = 0; i < featuresA.length; i++) {
            // Use a deep equality check for the fields property
            if (!deepEqual(featuresA[i].fields, featuresB[i].fields)) {
                return false;
            }
        }

        return true;
    };

    // Recursive deep equality check
    const deepEqual = (a, b) => {
        if (a === b) {
            return true;
        }

        if (
            typeof a !== "object" ||
            typeof b !== "object" ||
            a === null ||
            b === null
        ) {
            return false;
        }

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (const key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
                return false;
            }
        }

        return true;
    };

    useEffect(() => {
        if (store.byFeature !== null) {
            setFocusedField("feature");
            addField("_byFeature", store.byFeature);
        }
    }, [store.byFeature]);

    // Temp way for now to add field, need a better way
    useEffect(() => {
        if (store && store.fieldString) {
            const key = store.fieldString;
            addField(key, "");
        }
    }, [store.fieldString]);

    // Handler to add a new field to the selected feature
    const addField = (key, value) => {
        setFeatures((prevFeatures) => {
            const updatedFeatures = prevFeatures.map((feature) => ({
                ...feature,
                fields: {
                    ...feature.fields,
                    [key]: value,
                },
            }));
            return updatedFeatures;
        });
        // await store.setGeoJsonFeatures(features);
    };

    const removeField = (key) => {
        setFeatures((prevFeatures) => {
            const updatedFeatures = prevFeatures.map((feature) => {
                const updatedFields = { ...feature.fields };
                delete updatedFields[key];
                return {
                    ...feature,
                    fields: updatedFields,
                };
            });

            return updatedFeatures;
        });

        //reset byFeature
        if (store.byFeature == key) {
            store.setByFeature(null);
        }
    };

    // Handler to change the value of a field in the selected feature
    const changeFieldValue = async (key, newValue, updateAll = false) => {
        setFocusedField(key);
        setFeatures((prevFeatures) => {
            if (!updateAll) {
                console.log("setting indiv", key, newValue);

                if (store.currentArea === -1) {
                    // Feature not found, do nothing or handle accordingly
                    return prevFeatures;
                }

                const updatedFeatures = [...prevFeatures];
                const updatedFeature = {
                    ...updatedFeatures[store.currentArea],
                    fields: {
                        ...updatedFeatures[store.currentArea].fields,
                        [key]: newValue,
                    },
                };
                updatedFeatures[store.currentArea] = updatedFeature;
                return updatedFeatures;
            } else {
                return prevFeatures.map((feature, index) => {
                    return {
                        ...feature,
                        fields: {
                            ...feature.fields,
                            [key]: newValue,
                        },
                    };
                });
            }
        });
    };

    const commentBubbleStyle = {
        // Comment bubble styling
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.shadows[2],
        maxWidth: "90%",
    };

    function isNumeric(str) {
        if (typeof str != "string") return false; // we only process strings!
        return (
            !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str))
        ); // ...and ensure strings of whitespace fail
    }

    const handleChoroplethClick = (event) => {
        setAnchorElChoropleth(event.currentTarget);
    };

    const handleSelectedByFeature = (option) => {
        store.setByFeature(option);
        setAnchorElChoropleth(null);
    };

    const handleExport = () => {
        setCurrentModel("export");
    };
    const handlePublish = () => {
        setCurrentModel("publish");
    };
    const handleComments = () => {
        setCurrentModel("comment");
    };
    const handleEdit = () => {
        // Handle edit logic
    };
    const handleUndo = () => {
        // Handle edit logic
    };
    const handleRedo = () => {
        // Handle edit logic
    };
    const handleAddField = () => {
        setCurrentModel("addfield");
    };

    /**
     * Handler for when the user clicks on the like map button
     */
    const handleLike = async () => {
        if (hasLiked) {
            // If already liked, send request to unlike the map
            await store.likeMap(store.currentMap._id);
            setHasLiked(false);
        } else {
            // If not liked, send request to like the map
            await store.likeMap(store.currentMap._id);
            setHasLiked(true);
            setHasDisliked(false); // Reset dislike state
        }
    };

    /**
     * Handler for when the user clicks on the dislike map button
     */
    const handleDislike = async () => {
        if (hasDisliked) {
            // If already disliked, send request to undislike the map
            await store.dislikeMap(store.currentMap._id);
            setHasDisliked(false);
        } else {
            // If not disliked, send request to dislike the map
            await store.dislikeMap(store.currentMap._id);
            setHasDisliked(true);
            setHasLiked(false); // Reset like state
        }
    };

    /**
     * Handler for when the user clicks on like comment. Dynamically updates the votes
     * @param {*} commentId the id of the comment
     */
    const handleLikeComment = async (commentId) => {
        await store.likeComment(commentId);
        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    const hasLiked = comment.upvotes.includes(auth.user.userId);
                    const hasDisliked = comment.downvotes.includes(
                        auth.user.userId
                    );
                    return {
                        ...comment,
                        upvotes: hasLiked
                            ? comment.upvotes.filter(
                                  (userId) => userId !== auth.user.userId
                              )
                            : [...comment.upvotes, auth.user.userId],
                        downvotes: hasDisliked
                            ? comment.downvotes.filter(
                                  (userId) => userId !== auth.user.userId
                              )
                            : comment.downvotes,
                    };
                }
                return comment;
            })
        );
    };

    /**
     * Handler for when the user clicks on dislike comment. Dynamically updates the votes
     * @param {*} commentId the id of the comment
     */
    const handleDislikeComment = async (commentId) => {
        const updatedComment = await store.dislikeComment(commentId);
        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    const hasLiked = comment.upvotes.includes(auth.user.userId);
                    const hasDisliked = comment.downvotes.includes(
                        auth.user.userId
                    );
                    return {
                        ...comment,
                        upvotes: hasLiked
                            ? comment.upvotes.filter(
                                  (userId) => userId !== auth.user.userId
                              )
                            : comment.upvotes,
                        downvotes: hasDisliked
                            ? comment.downvotes.filter(
                                  (userId) => userId !== auth.user.userId
                              )
                            : [...comment.downvotes, auth.user.userId],
                    };
                }
                return comment;
            })
        );
    };

    const topLeft = () => {
        return (
            <Box
                sx={{
                    boxSizing: "border-box",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    bgcolor: theme.palette.primary.main, // Use theme color
                    padding: "10px",
                    boxShadow: 4,
                    zIndex: 1,
                    position: "relative", // Ensure this element is positioned
                }}
            >
                {/* Left-aligned Buttons */}
                <Box sx={{ marginRight: "auto" }}>
                    <Button
                        variant="contained"
                        onClick={handleExport}
                        sx={{
                            width: "100px",
                            marginRight: "10px",
                            backgroundColor: theme.palette.secondary.main,
                            color: "black",
                        }}
                    >
                        Export
                    </Button>
                    <Button
                        disabled={isPublished}
                        variant="contained"
                        onClick={handlePublish}
                        sx={{
                            width: "100px",
                            backgroundColor: theme.palette.secondary.main,
                            color: "black",
                        }}
                    >
                        Publish
                    </Button>
                </Box>

                {/* Right-aligned Icons with like/dislike counts */}
                <Box display="flex" alignItems="center">
                    {" "}
                    {/* Ensure flex layout for this Box */}
                    <IconButton
                        disabled={!isPublished || !auth.loggedIn}
                        id="likeBtn"
                        onClick={handleLike}
                        sx={{ color: hasLiked ? "black" : "default" }}
                    >
                        <ThumbUp />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{store.likes}</Typography>{" "}
                    {/* Added margin for spacing */}
                    <IconButton
                        disabled={!isPublished || !auth.loggedIn}
                        id="dislikeBtn"
                        onClick={handleDislike}
                        sx={{ color: hasDisliked ? "black" : "default" }}
                    >
                        <ThumbDown />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{store.dislikes}</Typography>{" "}
                    {/* Added margin for spacing */}
                </Box>
            </Box>
        );
    };

    const topRight = () => {
        return (
            <Box
                gridArea={"topbar"}
                sx={{
                    boxSizing: "border-box",
                    display: "flex",
                    justifyContent: "flex-end",
                    bgcolor: theme.palette.primary.main,
                    padding: "4px",
                    boxShadow: 4,
                    height: "60px",
                    zIndex: 1,
                    position: "relative",
                }}
            >
                <Box sx={{ width: "100%", height: "relative" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="fullWidth"
                        aria-label="edit-comment-tab-bar"
                        sx={{
                            ".MuiTabs-indicator": {
                                backgroundColor: "black",
                            },
                        }}
                    >
                        {
                            (store.currentMap && !store.currentMap.published) ?
                            <Tab
                                id="editTab"
                                sx={{ "&.Mui-selected": { color: "black" } }}
                                onClick={handleEdit}
                                value="1"
                                label="Edit"
                            /> : ("")
                        }
                        <Tab
                            id="commentTab"
                            sx={{ "&.Mui-selected": { color: "black" } }}
                            onClick={handleEdit}
                            value={(store.currentMap && !store.currentMap.published) ? "2" : "1"}
                            label="Comment"
                        />
                    </Tabs>
                </Box>
            </Box>
        );
    };

    const mapView = () => {
        return (
            <Box
                gridArea={"mapview"}
                sx={{
                    position: "relative", // Position the container relatively
                    flex: "1",
                    width: "100%",
                    height: `calc(100vh - 125px)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                {store.geojson && <NavJSON data={store.geojson} />}
                <Box
                    sx={{
                        position: "absolute", // Absolutely position the button container
                        bottom: 20, // Adjust as needed
                        left: 20, // Adjust as needed
                        zIndex: 1000, // Ensure it's above the map
                    }}
                >
                    {auth.loggedIn && (
                        <IconButton
                            id="undoBtn"
                            sx={{
                                backgroundColor: "#fff",
                                padding: "10px",
                                borderRadius: "5px",
                                color: "black",
                                margin: "0 5px 0 0",
                                border: "2px solid #ccc",
                                "&:hover": {
                                    backgroundColor: "#CCCCCC",
                                },
                            }}
                            onClick={() => handleUndo()}
                        >
                            <Undo />
                        </IconButton>
                    )}
                    {auth.loggedIn && (
                        <IconButton
                            id="redoBtn"
                            sx={{
                                backgroundColor: "#fff",
                                padding: "10px",
                                borderRadius: "5px",
                                color: "black",
                                border: "2px solid #ccc",
                                "&:hover": {
                                    backgroundColor: "#CCCCCC",
                                },
                            }}
                            onClick={() => handleRedo()}
                        >
                            <Redo />
                        </IconButton>
                    )}
                </Box>
            </Box>
        );
    };

    const commentSide = () => {
        return (
            <Box
                sx={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    padding: "10px",
                    width: "100%",
                    height: "100%",
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Box
                    sx={{
                        height: `calc(100vh - 181px)`,
                        overflow: "auto",
                    }}
                >
                    {/* Map through the comments and display them */}
                    {comments.map((comment, index) => (
                        <Paper key={index} sx={commentBubbleStyle}>
                            <Typography variant="body1" key={index}>
                                {comment.text}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ display: "block", marginTop: "5px" }}
                            >
                                <Typography variant="caption">
                                    Author: {comment.author}
                                </Typography>
                                <br></br>
                                {new Date(comment.ask_date).toLocaleString()}
                            </Typography>

                            <IconButton
                                sx={{
                                    color: comment.upvotes.includes(
                                        (auth.user && auth.user.userId) ? auth.user.userId : "####"
                                    )
                                        ? "black"
                                        : "default",
                                }}
                                onClick={() => handleLikeComment(comment.id)}
                            >
                                <ThumbUp sx={{ fontSize: "small" }}></ThumbUp>
                            </IconButton>
                            <Typography variant="caption">
                                {comment.upvotes.length}
                            </Typography>
                            <IconButton
                                sx={{
                                    color: comment.downvotes.includes(
                                        (auth.user && auth.user.userId) ? auth.user.userId : "####"
                                    )
                                        ? "black"
                                        : "default",
                                }}
                                onClick={() => handleDislikeComment(comment.id)}
                            >
                                <ThumbDown
                                    sx={{ fontSize: "small" }}
                                ></ThumbDown>
                            </IconButton>
                            <Typography variant="caption">
                                {comment.downvotes.length}
                            </Typography>
                        </Paper>
                    ))}
                </Box>

                <Button
                    disabled={!auth.loggedIn}
                    variant="contained"
                    sx={{
                        width: "100%",
                        color: "black",
                        bgcolor: theme.palette.secondary.main,
                    }}
                    onClick={handleComments}
                >
                    Add Comment
                </Button>
            </Box>
        );
    };

    const editBar = () => {
        // const [selectedItem, setSelectedItem] = useState("");

        const fieldEdit = () => {
            if (store.currentArea === -1) {
                return null;
            }
            const selectedFeature = features[store.currentArea];

            return (
                <>
                    <Box
                        sx={{
                            overflow: "auto",
                            padding: "10px",
                        }}
                    >
                        <Box
                            key={"name"}
                            sx={{
                                display: "flex", // Add this line
                                mb: "10px",
                            }}
                        >
                            <TextField
                                label="Name"
                                value={
                                    selectedFeature &&
                                    selectedFeature.fields &&
                                    selectedFeature.fields.name
                                }
                                onChange={(e) =>
                                    changeFieldValue("name", e.target.value)
                                }
                                onBlur={() => setFocusedField(null)}
                                sx={{ width: "100%" }}
                            />
                            {/* No delete icon for 'name' */}
                        </Box>

                        {/* <TextField
                            label="FIELD WITH NO GARBAGE"
                            defaultValue="Hello World"
                        />

                        <Box sx={{ display: "flex" }}>
                            <TextField
                                label="FIELD WITH GARBAGE"
                                defaultValue="Hello World"
                            />
                            <IconButton onClick={() => removeField(key)}>
                                <Delete />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <TextField
                                label="Longitude"
                                defaultValue="Hello World"
                                sx={{ mr: "5px" }}
                            />
                            <TextField
                                label="Latitude"
                                defaultValue="Hello World"
                                sx={{ ml: "5px" }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <MuiColorInput sx={{ mr: "5px" }}></MuiColorInput>
                            <MuiColorInput sx={{ ml: "5px" }}></MuiColorInput>
                        </Box> */}

                        {/* Mapping through other fields */}
                        {selectedFeature &&
                            selectedFeature.fields &&
                            Object.entries(selectedFeature.fields).map(
                                ([key, value]) =>
                                    key !== "name" &&
                                    key !== "_byFeature" && (
                                        <Box
                                            key={key}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    alignSelf: "center",
                                                    marginRight: "10px",
                                                }}
                                            >
                                                <Typography>
                                                    {key
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        key.slice(1)}
                                                    :
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignSelf: "flex-end",
                                                }}
                                            >
                                                {!(
                                                    key == "scale" ||
                                                    key == "radius" ||
                                                    key == "center_longitude" ||
                                                    key == "center_latitude"
                                                ) ? (
                                                    <>
                                                        <TextField
                                                            value={value}
                                                            onChange={(e) =>
                                                                changeFieldValue(
                                                                    key,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            onBlur={() =>
                                                                setFocusedField(
                                                                    null
                                                                )
                                                            }
                                                        />
                                                        <IconButton
                                                            onClick={() =>
                                                                removeField(key)
                                                            }
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </>
                                                ) : (
                                                    <TextField
                                                        value={value}
                                                        onChange={(e) => {
                                                            key ==
                                                                "center_longitude" ||
                                                            key ==
                                                                "center_latitude"
                                                                ? changeFieldValue(
                                                                      key,
                                                                      e.target
                                                                          .value
                                                                  )
                                                                : changeFieldValue(
                                                                      key,
                                                                      e.target
                                                                          .value,
                                                                      true
                                                                  );
                                                        }}
                                                        onBlur={() =>
                                                            setFocusedField(
                                                                null
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    )
                            )}
                    </Box>
                </>
            );
        };

        return (
            <Box
                gridArea={"editBar"}
                sx={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    height: `calc(100vh - 125px)`,
                    width: "100%",
                    padding: "10px",
                    boxShadow: 1,
                    bgcolor: theme.palette.background.paper,
                }}
            >
                {store.currentArea == -1 ? (
                    <Typography variant="h6">Choose an area to edit</Typography>
                ) : (
                    <>
                        {auth.loggedIn && (
                            <Button
                                id="addFieldBtn"
                                variant="contained"
                                color="primary"
                                onClick={handleAddField}
                                sx={{
                                    color: "black",
                                    bgcolor: theme.palette.secondary.main,
                                    width: "100%",
                                    mb: "10px",
                                }}
                            >
                                + Add Field
                            </Button>
                        )}
                        <Box
                            sx={{
                                overflow: "auto",
                                maxHeight: "calc(100vh - 220px)", // Adjust the maxHeight as needed
                                mb: "10px",
                            }}
                        >
                            {fieldEdit()}
                        </Box>

                        {/* Spacer to push accordion to the bottom */}
                        <Box sx={{ flexGrow: 1 }}></Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Accordion
                                sx={{
                                    width: "100%",
                                    bgcolor: theme.palette.secondary.main,
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography>
                                        Advanced Editing Features
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List
                                        component="nav"
                                        aria-label="Device settings"
                                        sx={{
                                            bgcolor:
                                                theme.palette.background
                                                    .default,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <ListItem
                                            aria-expanded={
                                                handleChoroplethClick
                                                    ? "true"
                                                    : undefined
                                            }
                                            onClick={handleChoroplethClick}
                                        >
                                            <ListItemText
                                                primary="Select heat map by"
                                                secondary={selectedItem}
                                            />
                                        </ListItem>
                                    </List>
                                    <Menu
                                        anchorEl={anchorElChoropleth}
                                        open={Boolean(anchorElChoropleth)}
                                        onClose={() => {
                                            setAnchorElChoropleth(null);
                                        }}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "left",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "left",
                                        }}
                                    >
                                        {store.geojson &&
                                            store.geojson.features &&
                                            store.currentArea !== null &&
                                            store.geojson.features[
                                                store.currentArea
                                            ] &&
                                            store.geojson.features[
                                                store.currentArea
                                            ].fields &&
                                            Object.entries(
                                                store.geojson.features[
                                                    store.currentArea
                                                ].fields
                                            ).map(([key, value]) => {
                                                if (
                                                    isNumeric(value) &&
                                                    key != "_byFeature"
                                                ) {
                                                    return (
                                                        <MenuItem
                                                            key={key}
                                                            onClick={() => {
                                                                handleSelectedByFeature(
                                                                    key
                                                                );
                                                                setSelectedItem(
                                                                    key
                                                                );
                                                            }}
                                                        >
                                                            {key}
                                                        </MenuItem>
                                                    );
                                                }
                                                return null;
                                            })}
                                    </Menu>
                                    {/* <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography sx={{ m: "10px" }}>
                                            {store.currentMap &&
                                                store.currentMap.mapType}{" "}
                                            by:
                                        </Typography>
                                        <Box sx={{ textAlign: "right" }}>
                                            <Button
                                                onClick={handleChoroplethClick}
                                                variant="contained"
                                                sx={{
                                                    color: "black",
                                                    width: "150px",
                                                    bgcolor:
                                                        theme.palette.secondary
                                                            .main,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <span>
                                                        {store.byFeature &&
                                                            store.byFeature}
                                                    </span>
                                                    <KeyboardArrowDown />
                                                </Box>
                                            </Button>
                                        </Box>
                                    </Box> */}
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </>
                )}
            </Box>
        );
    };
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "3fr 1fr", // 3:1 ratio for main content and sidebar
                // gridTemplateRows: '7vh auto', // Allocate 10vh for top bar, rest for content
                height: "auto", // Ensure the total height is 100vh
                overflow: "hidden", // Prevent any overflow
            }}
        >
            <Box
                sx={{
                    gridColumn: "1",
                    gridRow: "1",
                    textAlign: "left",
                    paddingTop: "1px",
                    zIndex: 1,
                }}
            >
                {topLeft()}
            </Box>
            <Box
                sx={{
                    gridColumn: "2",
                    gridRow: "1",
                    textAlign: "right",
                    paddingTop: "1px",
                }}
            >
                {topRight()}
            </Box>
            <Box sx={{ gridColumn: "1", gridRow: "2", zIndex: 0 }}>
                {mapView()}
            </Box>

            <Box sx={{ gridColumn: "2", gridRow: "2" }}>
                {value === "1" && store.currentMap && !store.currentMap.published ? editBar() : commentSide()}
            </Box>
            {currentModel === "export" && (
                <MUIExportMapModal
                    open={currentModel === "export"}
                    onClose={() => setCurrentModel("")}
                />
            )}
            {currentModel === "publish" && (
                <MUIPublishMapModal
                    open={currentModel === "publish"}
                    onClose={() => setCurrentModel("")}
                />
            )}
            {currentModel === "comment" && (
                <MUICommentModal
                    open={currentModel === "comment"}
                    onClose={() => setCurrentModel("")}
                />
            )}
            {currentModel === "addfield" && (
                <MUIAddFieldModal
                    open={currentModel === "addfield"}
                    onClose={() => setCurrentModel("")}
                />
            )}
        </Box>
    );
}

export default MapViewingPage;

// useEffect(() => {
//   if (store.geojson == null) {
//     store.getGeojson(id);
//   }
// }, [store.geojson, id]);
