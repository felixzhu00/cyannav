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
import { useParams } from "react-router-dom";

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
        if (store.currentMap != null) {
            setIsPublished(store.currentMap.published);
            setHasLiked(store.currentMap.like.includes(auth.user.userId));
            setHasDisliked(store.currentMap.dislike.includes(auth.user.userId));
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
                                auth.user.userId
                            ),
                            hasDislikedComment: response.downvotes.includes(
                                auth.user.userId
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
                const originalFields = feature.fields || { immutable: {} };

                if (!originalFields.immutable) {
                    originalFields.immutable = {};
                }
                //Set name field if name doesnt exist
                if (originalFields?.immutable?.name === undefined) {
                    originalFields.immutable.name = feature.properties.admin;
                }

                //Set center if center doesnt exist
                if (originalFields?.immutable?.center === undefined) {
                    originalFields.immutable.center = {};
                    const coordinates =
                        turf.centerOfMass(feature).geometry.coordinates;
                    const roundedCoordinates = coordinates.map((coord) =>
                        parseFloat(coord).toFixed(3)
                    );
                    const [lng, lat] = roundedCoordinates;

                    originalFields.immutable.center.longitude = String(lng);
                    originalFields.immutable.center.latitude = String(lat);
                }

                // Add required field for map type
                if (
                    originalFields?.immutable?.radius === undefined &&
                    (store.currentMap.mapType === "heatmap" ||
                        store.currentMap.mapType === "pointmap")
                ) {
                    originalFields.immutable.radius = 0;
                } else if (
                    originalFields?.immutable?.weight === undefined &&
                    store.currentMap.mapType === "distributiveflowmap"
                ) {
                    originalFields.immutable.weight = 0;
                } else if (
                    originalFields?.immutable?.scale === undefined &&
                    store.currentMap.mapType === "3drectangle"
                ) {
                    originalFields.immutable.scale = 0;
                } else if (
                    originalFields?.immutable?.color === undefined &&
                    (store.currentMap.mapType === "choroplethmap" ||
                        store.currentMap.mapType === "pointmap" ||
                        store.currentMap.mapType === "3drectangle")
                ) {
                    originalFields.immutable.color = {};
                    originalFields.immutable.color.colorA = "#808080";
                    originalFields.immutable.color.colorB = "#000000";
                }

                return {
                    ...feature,
                    fields: originalFields,
                };
            });
            setFeatures(updatedFeatures);
        }
        //Sets the exisitng map by feature if it exist
        if (store.geojson?.features[0]?.fields?.immutable?.byFeature) {
            const currentFeature =
                store.geojson.features[0].fields.immutable.byFeature;
            if (
                store.geojson.features[0].fields.mutable.hasOwnProperty(
                    currentFeature
                )
            ) {
                store.setByFeature(
                    store.geojson.features[0].fields.immutable.byFeature
                );
            }
        }
    }, [store.geojson]);

    useEffect(() => {
        if (
            features.length !== 0 &&
            focusedFieldRef.current !== focusedField
            // &&
            // !areFeaturesEqual(features, store.geojson.features)
        ) {
            store.setGeoJsonFeatures(features);
        }
        focusedFieldRef.current = focusedField;
        setFocusedField(null);
    }, [focusedField, features]);

    useEffect(() => {}, [store.isPickingDFM]);

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
            addField("byFeature", store.byFeature);
        }
    }, [store.byFeature]);

    useEffect(() => {
        if (
            store.currentArea !== -1 &&
            store.selectedArea !== -1 &&
            store.selectedArea !== store.currentArea &&
            store.geojson.features[store.currentArea]?.fields?.mutable &&
            !Object.keys(
                store.geojson.features[store.currentArea]?.fields?.mutable
            ).some((key) => {
                const match = key.match(/^(\d+)_(.+)/);
                return match && Number(match[1]) === store.selectedArea;
            })
        ) {
            console.log("trigger when not");
            const name =
                store.selectedArea +
                "_" +
                store.geojson.features[store.selectedArea].fields.immutable
                    .name;

            addField(name, 0, false);
            handleAddLineDone();
        }
    }, [store.currentArea, store.selectedArea]);

    // Temp way for now to add field, need a better way
    useEffect(() => {
        if (store && store.fieldString) {
            const key = store.fieldString;
            addField(key, "");
        }
    }, [store.fieldString]);

    // Handler to add a new field to the selected feature
    const addField = (key, value, applyAll = true) => {
        setFocusedField(key);
        setFeatures((prevFeatures) => {
            if (applyAll) {
                const updatedFeatures = prevFeatures.map((feature) => {
                    const isImmutable = [
                        "radius",
                        "scale",
                        "longitude",
                        "latitude",
                        "byFeature",
                    ].includes(key);

                    const updatedFields = {
                        immutable: isImmutable
                            ? { ...feature.fields.immutable, [key]: value }
                            : { ...feature.fields.immutable },
                        mutable: !isImmutable
                            ? { ...feature.fields.mutable, [key]: value }
                            : { ...feature.fields.mutable },
                    };

                    return {
                        ...feature,
                        fields: updatedFields,
                    };
                });

                return updatedFeatures;
            } else {
                // Apply changes only to prevFeatures[store.currentArea]
                const updatedFeatures = prevFeatures.map((feature, index) => {
                    if (index === store.currentArea) {
                        const updatedFields = {
                            immutable: { ...feature.fields.immutable },
                            mutable: {
                                ...feature.fields.mutable,
                                [key]: value,
                            },
                        };

                        return {
                            ...feature,
                            fields: updatedFields,
                        };
                    } else {
                        return feature;
                    }
                });

                return updatedFeatures;
            }
        });
    };

    const removeField = (key, applyAll = true) => {
        setFocusedField(key);

        setFeatures((prevFeatures) => {
            const updatedFeatures = prevFeatures.map((feature, index) => {
                const isImmutable = [
                    "radius",
                    "scale",
                    "longitude",
                    "latitude",
                    "byFeature",
                ].includes(key);

                const updatedFields = {
                    immutable: { ...feature.fields.immutable },
                    mutable: { ...feature.fields.mutable },
                };

                if (isImmutable) {
                    delete updatedFields.immutable[key];
                } else {
                    delete updatedFields.mutable[key];
                }

                if (!applyAll) {
                    return index === store.currentArea
                        ? { ...feature, fields: updatedFields }
                        : feature;
                } else {
                    return {
                        ...feature,
                        fields: updatedFields,
                    };
                }
            });

            return updatedFeatures;
        });

        // reset byFeature
        if (store.byFeature === key) {
            store.setByFeature(null);
        }
    };

    const changeFieldValue = async (key, newValue, updateAll = false) => {
        setFeatures((prevFeatures) => {
            if (!updateAll) {
                if (store.currentArea === -1) {
                    // Feature not found, do nothing or handle accordingly
                    return prevFeatures;
                }

                const isImmutable = [
                    "radius",
                    "scale",
                    "longitude",
                    "latitude",
                    "byFeature",
                    "weight",
                    "name",
                ].includes(key);

                const updatedFeatures = [...prevFeatures];

                let updatedFeature = {};

                if (
                    key === "longitude" ||
                    key === "latitude" ||
                    key === "colorA"
                ) {
                    let targetKeyValue = {};
                    if (key === "longitude" || key === "latitude") {
                        targetKeyValue = {
                            center: {
                                ...updatedFeatures[store.currentArea].fields
                                    .immutable.center,
                                [key]: newValue,
                            },
                        };
                    } else {
                        targetKeyValue = {
                            color: {
                                ...updatedFeatures[store.currentArea].fields
                                    .immutable.color,
                                [key]: newValue,
                            },
                        };
                    }

                    updatedFeature = {
                        ...updatedFeatures[store.currentArea],
                        fields: {
                            immutable: {
                                ...updatedFeatures[store.currentArea].fields
                                    .immutable,
                                ...targetKeyValue,
                            },
                            mutable: {
                                ...updatedFeatures[store.currentArea].fields
                                    .mutable,
                            },
                        },
                    };
                } else {
                    updatedFeature = {
                        ...updatedFeatures[store.currentArea],
                        fields: {
                            immutable: isImmutable
                                ? {
                                      ...updatedFeatures[store.currentArea]
                                          .fields.immutable,
                                      [key]: newValue,
                                  }
                                : {
                                      ...updatedFeatures[store.currentArea]
                                          .fields.immutable,
                                  },
                            mutable: !isImmutable
                                ? {
                                      ...updatedFeatures[store.currentArea]
                                          .fields.mutable,
                                      [key]: newValue,
                                  }
                                : {
                                      ...updatedFeatures[store.currentArea]
                                          .fields.mutable,
                                  },
                        },
                    };
                }

                updatedFeatures[store.currentArea] = updatedFeature;
                return updatedFeatures;
            } else {
                return prevFeatures.map((feature) => {
                    const isImmutable = [
                        "radius",
                        "scale",
                        "longitude",
                        "latitude",
                        "byFeature",
                    ].includes(key);

                    let updatedFeature = {};

                    if (key === "colorA" || key === "colorB") {
                        updatedFeature = {
                            ...feature,
                            fields: {
                                immutable: {
                                    ...feature.fields.immutable,
                                    color: {
                                        ...feature.fields.immutable.color,
                                        [key]: newValue,
                                    },
                                },
                                mutable: {
                                    ...feature.fields.mutable,
                                },
                            },
                        };
                    } else {
                        updatedFeature = {
                            ...feature,
                            fields: {
                                immutable: isImmutable
                                    ? {
                                          ...feature.fields.immutable,
                                          [key]: newValue,
                                      }
                                    : { ...feature.fields.immutable },
                                mutable: !isImmutable
                                    ? {
                                          ...feature.fields.mutable,
                                          [key]: newValue,
                                      }
                                    : { ...feature.fields.mutable },
                            },
                        };
                    }

                    console.log("updatedFeature", updatedFeature);
                    return updatedFeature;
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

    const handleAddLine = () => {
        console.log(store.isPickingDFM);
        store.setIsPickingDFM(true);
    };
    const handleAddLineDone = () => {
        store.setIsPickingDFM(false);
        store.setSelectedArea(-1);
        store.setCurrentArea(-1);
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
                        <Tab
                            id="editTab"
                            sx={{ "&.Mui-selected": { color: "black" } }}
                            onClick={handleEdit}
                            value="1"
                            label="Edit"
                        />
                        <Tab
                            id="commentTab"
                            sx={{ "&.Mui-selected": { color: "black" } }}
                            onClick={handleEdit}
                            value="2"
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
                                        auth.user.userId
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
                                        auth.user.userId
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
        const [selectedItem, setSelectedItem] = useState("");

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
                                value={selectedFeature?.fields?.immutable?.name}
                                onChange={(e) =>
                                    changeFieldValue("name", e.target.value)
                                }
                                onBlur={() => setFocusedField("name")}
                                sx={{ width: "100%" }}
                            />
                        </Box>

                        {/* Mapping through other fields */}
                        {selectedFeature?.fields?.mutable &&
                            Object.entries(selectedFeature.fields.mutable).map(
                                ([key, value]) => (
                                    <Box key={key} sx={{ display: "flex" }}>
                                        <TextField
                                            label={(() => {
                                                const match =
                                                    key.match(/^(\d+)_(.+)/);
                                                if (match) {
                                                    const [, , secondPart] =
                                                        match;
                                                    return (
                                                        secondPart
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        secondPart.slice(1)
                                                    );
                                                } else {
                                                    return (
                                                        key
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        key.slice(1)
                                                    ); // or provide a default label
                                                }
                                            })()}
                                            // defaultValue="Enter A Value"
                                            value={value}
                                            onChange={(e) =>
                                                changeFieldValue(
                                                    key,
                                                    e.target.value
                                                )
                                            }
                                            onBlur={() => setFocusedField(key)}
                                        />
                                        <IconButton
                                            onClick={() => {
                                                const match =
                                                    key.match(/^(\d+)_(.+)/);
                                                if (match) {
                                                    removeField(key, false);
                                                } else {
                                                    removeField(key);
                                                }
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
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
                {store?.isPickingDFM ? (
                    store.geojson.features[store.currentArea]?.fields
                        ?.mutable &&
                    Object.keys(
                        store.geojson.features[store.currentArea]?.fields
                            ?.mutable
                    ).some((key) => {
                        const match = key.match(/^(\d+)_(.+)/);
                        return match && Number(match[1]) === store.selectedArea;
                    }) ? (
                        <>
                            <Typography variant="h6">
                                You have chosen the area already
                            </Typography>
                            <Button
                                id="chosenAreaBtn"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    handleAddLineDone();
                                }}
                                sx={{
                                    color: "black",
                                    bgcolor: theme.palette.secondary.main,
                                    width: "100%",
                                    mb: "10px",
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : store.selectedArea === store.currentArea ? (
                        <>
                            <Typography variant="h6">
                                Please choose a destination that is not itself
                            </Typography>
                            <Button
                                id="notItselfBtn"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    handleAddLineDone();
                                }}
                                sx={{
                                    color: "black",
                                    bgcolor: theme.palette.secondary.main,
                                    width: "100%",
                                    mb: "10px",
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">
                                Choose a destination for your line
                            </Typography>
                            <Button
                                id="destinationBtn"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    handleAddLineDone();
                                }}
                                sx={{
                                    color: "black",
                                    bgcolor: theme.palette.secondary.main,
                                    width: "100%",
                                    mb: "10px",
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    )
                ) : store.currentArea === -1 ? (
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

                                {features[store.currentArea]?.fields
                                    ?.immutable &&
                                    features[store.currentArea].fields
                                        .immutable["center"] && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                            }}
                                        >
                                            <TextField
                                                label="Longitude"
                                                value={
                                                    features[store.currentArea]
                                                        .fields.immutable.center
                                                        .longitude
                                                }
                                                onChange={(e) =>
                                                    changeFieldValue(
                                                        "longitude",
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={() =>
                                                    setFocusedField("longitude")
                                                }
                                                sx={{ mr: "5px" }}
                                            />
                                            <TextField
                                                label="Latitude"
                                                value={
                                                    features[store.currentArea]
                                                        .fields.immutable.center
                                                        .latitude
                                                }
                                                onChange={(e) =>
                                                    changeFieldValue(
                                                        "latitude",
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={() =>
                                                    setFocusedField("latitude")
                                                }
                                                sx={{ ml: "5px" }}
                                            />
                                        </Box>
                                    )}
                                {features[store.currentArea]?.fields
                                    ?.immutable &&
                                    ["radius", "scale", "weight", "color"].map(
                                        (key) => {
                                            // Define map types for each key
                                            const mapTypes = {
                                                radius: ["pointmap", "heatmap"],
                                                scale: ["3drectangle"],
                                                weight: ["distributiveflowmap"],
                                                color: [
                                                    "choroplethmap",
                                                    "pointmap",
                                                    "3drectangle",
                                                ],
                                            };

                                            // Check if the key exists in features[store.currentArea]?.fields?.immutable
                                            const keyExists =
                                                features[store.currentArea]
                                                    ?.fields?.immutable &&
                                                features[store.currentArea]
                                                    .fields.immutable[key] !==
                                                    undefined &&
                                                features[store.currentArea]
                                                    .fields.immutable[key] !==
                                                    null;

                                            // Check if the key has a non-null value based on the map type
                                            const mapType =
                                                store.currentMap?.mapType;
                                            return (
                                                keyExists &&
                                                mapTypes[key]?.includes(
                                                    mapType
                                                ) && (
                                                    <Box
                                                        key={
                                                            key +
                                                            store.currentArea
                                                        }
                                                        sx={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        {key === "color" &&
                                                        (mapType ===
                                                            "choroplethmap" ||
                                                            mapType ===
                                                                "pointmap" ||
                                                            mapType ===
                                                                "3drectangle") ? (
                                                            <>
                                                                <MuiColorInput
                                                                    format="hex"
                                                                    fallbackValue="#FFEDA0"
                                                                    value={
                                                                        features[
                                                                            store
                                                                                .currentArea
                                                                        ]
                                                                            ?.fields
                                                                            ?.immutable
                                                                            ?.color
                                                                            ?.colorA ||
                                                                        "#000000"
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        mapType !==
                                                                        "pointmap"
                                                                            ? changeFieldValue(
                                                                                  "colorA",
                                                                                  e,
                                                                                  true
                                                                              )
                                                                            : changeFieldValue(
                                                                                  "colorA",
                                                                                  e
                                                                              );
                                                                    }}
                                                                    onBlur={() =>
                                                                        setFocusedField(
                                                                            "colorA"
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        mr: "5px",
                                                                    }}
                                                                />
                                                                <MuiColorInput
                                                                    format="hex"
                                                                    fallbackValue="#800026"
                                                                    value={
                                                                        features[
                                                                            store
                                                                                .currentArea
                                                                        ]
                                                                            ?.fields
                                                                            ?.immutable
                                                                            ?.color
                                                                            ?.colorB ||
                                                                        "#000000"
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        mapType !==
                                                                        "pointmap"
                                                                            ? changeFieldValue(
                                                                                  "colorA",
                                                                                  e,
                                                                                  true
                                                                              )
                                                                            : changeFieldValue(
                                                                                  "colorA",
                                                                                  e
                                                                              );
                                                                    }}
                                                                    onBlur={() =>
                                                                        setFocusedField(
                                                                            "colorB"
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        mr: "5px",
                                                                    }}
                                                                />
                                                            </>
                                                        ) : (
                                                            <TextField
                                                                label={
                                                                    key
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                    key.slice(1)
                                                                } // Capitalize the first letter of the key
                                                                value={
                                                                    features[
                                                                        store
                                                                            .currentArea
                                                                    ].fields
                                                                        .immutable[
                                                                        key
                                                                    ]
                                                                }
                                                                onChange={(e) =>
                                                                    changeFieldValue(
                                                                        key,
                                                                        e.target
                                                                            .value,
                                                                        true
                                                                    )
                                                                }
                                                                onBlur={() =>
                                                                    setFocusedField(
                                                                        key
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </Box>
                                                )
                                            );
                                        }
                                    )}
                                {store.currentMap?.mapType ===
                                "distributiveflowmap" ? (
                                    <Button
                                        id="addLineBtn"
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddLine}
                                        sx={{
                                            color: "black",
                                            bgcolor:
                                                theme.palette.secondary.main,
                                            width: "100%",
                                            mb: "10px",
                                        }}
                                    >
                                        + Add Line
                                    </Button>
                                ) : (
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
                                                    primary={`Select ${store.currentMap.mapType} by ${store.byFeature}`}
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
                                            {(() => {
                                                const addedKeys = [];
                                                return store.geojson?.features.flatMap(
                                                    (feature) =>
                                                        Object.entries(
                                                            feature.fields
                                                                .mutable
                                                        ).map(
                                                            ([key, value]) => {
                                                                if (
                                                                    isNumeric(
                                                                        value
                                                                    ) &&
                                                                    !addedKeys.includes(
                                                                        key
                                                                    )
                                                                ) {
                                                                    addedKeys.push(
                                                                        key
                                                                    );
                                                                    return (
                                                                        <MenuItem
                                                                            key={
                                                                                key
                                                                            }
                                                                            onClick={() => {
                                                                                handleSelectedByFeature(
                                                                                    key
                                                                                );
                                                                                setSelectedItem(
                                                                                    key
                                                                                );
                                                                            }}
                                                                        >
                                                                            {
                                                                                key
                                                                            }
                                                                        </MenuItem>
                                                                    );
                                                                }
                                                                return null;
                                                            }
                                                        )
                                                );
                                            })()}
                                        </Menu>
                                        ;
                                    </AccordionDetails>
                                )}
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
                {value === "1" ? editBar() : commentSide()}
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
