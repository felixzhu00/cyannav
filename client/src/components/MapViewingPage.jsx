import React, { useState, useEffect, useContext, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
    Alert,
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
    Tooltip,
    useTheme,
    Snackbar,
} from "@mui/material";
import {
    Undo,
    Redo,
    Delete,
    ExpandMore,
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

import UndoRedo from "./UndoRedo";
import { useHotkeys } from "react-hotkeys-hook";

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

    /**
     * Trigger if textfield is unfocused
     */
    const [focusedField, setFocusedField] = useState(null);
    const focusedFieldRef = useRef(null);

    /**
     * Field selection for map type
     */
    const [selectedItem, setSelectedItem] = useState("");

    const { addUndo, addRedo, getUndo, getRedo } = UndoRedo();

    // Redirect
    const navigate = useNavigate();

    // Snackbar to tell the user that CTRL+Z and CTRL+Y does not work. Must use buttons.
    const [openSnackbar, setOpenSnackbar] = useState(false);

    //Runs on initial load
    useEffect(() => {
        if (id != null) {
            store.getMapById(id);
            store.getGeojson(id);
        }
        return () => {
            store.setGeoJson(null)
            store.setCurrentMap(null)
            store.setCurrentArea(-1);
            store.setByFeature(null);
        };
    }, [id]);

    useEffect(() => {
        if (store.currentMap == "Unauthorized") {
            navigate("/unauthorized");
            return;
        }
        if (store.currentMap == "Notfound") {
            navigate("/mapnotfound");
            return;
        }

        if (store.currentMap != null) {
            setIsPublished(store.currentMap.published);
            if (auth.user && auth.user.userId) {
                setHasLiked(store.currentMap.like.includes(auth.user.userId));
                setHasDisliked(
                    store.currentMap.dislike.includes(auth.user.userId)
                );
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
                                auth.user && auth.user.userId
                                    ? auth.user.userId
                                    : "####"
                            ),
                            hasDislikedComment: response.downvotes.includes(
                                auth.user && auth.user.userId
                                    ? auth.user.userId
                                    : "####"
                            ),
                        })
                    );
                    setComments(fetchedComments.reverse());
                } catch (error) {
                    console.error("Error fetching comments:", error);
                }
            };
            fetchComments();
        }
    }, [store.currentMap]);

    useEffect(() => {
        if (
            store.geojson &&
            store.geojson.features &&
            store?.currentMap?.mapType
        ) {
            const updatedFeatures = store.geojson.features.map((feature) => {
                const originalFields = feature.fields || { immutable: {} };

                if (!originalFields.immutable) {
                    originalFields.immutable = {};
                }
                if (!originalFields.mutable) {
                    originalFields.mutable = {};
                }
                //Set name field if name doesnt exist
                if (originalFields?.immutable?.name === undefined) {
                    originalFields.immutable.name = feature.properties.admin;
                }

                //Set center if center doesnt exist
                if (
                    originalFields?.immutable?.center === undefined &&
                    store.currentMap.mapType !== "choroplethmap"
                ) {
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
            setFocusedField("feature");
            setFeatures(updatedFeatures);
            store.exportImage();
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
        if (features.length !== 0 && focusedFieldRef.current !== focusedField) {
            // First load of vanilla geojson, convert to navjson
            if (store.geojson.features[0].fields == null) {
                store.geojson.features = features;
                return;
            }

            var diffIndex = findFeatureDiffIndex(
                features,
                store.geojson.features
            );

            if (diffIndex !== -1) {
                store.setGeoJsonFeatures(features);

                // Get the old value and new value of the change.
                // Special thanks to Felix for making go from 2 lines to this mess.
                var oldValue, newValue;
                if (focusedField == "colorA" || focusedField == "colorB") {
                    oldValue =
                        store.geojson.features[diffIndex].fields.immutable
                            .color[focusedField];
                    newValue =
                        features[diffIndex].fields.immutable.color[
                            focusedField
                        ];
                } else if (
                    focusedField == "longitude" ||
                    focusedField == "latitude"
                ) {
                    oldValue =
                        store.geojson.features[diffIndex].fields.immutable
                            .center[focusedField];
                    newValue =
                        features[diffIndex].fields.immutable.center[
                            focusedField
                        ];
                } else if (focusedField == "byFeature") {
                    oldValue =
                        store.geojson.features[diffIndex].fields.immutable[
                            focusedField
                        ];
                    newValue =
                        features[diffIndex].fields.immutable[focusedField];
                } else if (focusedField == "name") {
                    oldValue =
                        store.geojson.features[diffIndex].fields.immutable[
                            focusedField
                        ];
                    newValue =
                        features[diffIndex].fields.immutable[focusedField];
                } else {
                    oldValue =
                        store.geojson.features[diffIndex].fields.mutable[
                            focusedField
                        ];
                    newValue = features[diffIndex].fields.mutable[focusedField];
                }

                // This simply is when a new field is being set to ''
                // Or when fields are being deleted
                if (oldValue == undefined || newValue == undefined) {
                    return;
                }

                const newTransaction = [
                    diffIndex,
                    focusedField,
                    oldValue,
                    newValue,
                ];

                addUndo(newTransaction);
            }
        }
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

    const findFeatureDiffIndex = (featuresA, featuresB) => {
        if (featuresA.length !== featuresB.length) {
            return featuresA.length;
        }

        for (let i = 0; i < featuresA.length; i++) {
            // Use a deep equality check for the fields property
            if (!deepEqual(featuresA[i].fields, featuresB[i].fields)) {
                return i;
            }
        }

        return -1;
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
        if (store.byFeature !== null && store.geojson && store.currentMap) {
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
            const name =
                store.selectedArea +
                "_" +
                store.geojson.features[store.selectedArea].fields.immutable
                    .name;

            addField(name, 10, false);
            addUndo([-1, name, 10, store.currentArea]);
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
    const addField = (
        key,
        value,
        applyAll = true,
        values = null,
        currArea = null
    ) => {
        setFocusedField(key);
        setFeatures((prevFeatures) => {
            if (applyAll) {
                const updatedFeatures = prevFeatures.map((feature, index) => {
                    const isImmutable = [
                        "radius",
                        "scale",
                        "longitude",
                        "latitude",
                        "byFeature",
                    ].includes(key);

                    var updatedFields;

                    if (values !== null) {
                        updatedFields = {
                            immutable: isImmutable
                                ? {
                                      ...feature.fields.immutable,
                                      [key]: values[index],
                                  }
                                : { ...feature.fields.immutable },
                            mutable: !isImmutable
                                ? {
                                      ...feature.fields.mutable,
                                      [key]: values[index],
                                  }
                                : { ...feature.fields.mutable },
                        };
                    } else {
                        updatedFields = {
                            immutable: isImmutable
                                ? { ...feature.fields.immutable, [key]: value }
                                : { ...feature.fields.immutable },
                            mutable: !isImmutable
                                ? { ...feature.fields.mutable, [key]: value }
                                : { ...feature.fields.mutable },
                        };
                    }

                    return {
                        ...feature,
                        fields: updatedFields,
                    };
                });

                return updatedFeatures;
            } else {
                // Apply changes only to prevFeatures[store.currentArea]
                const updatedFeatures = prevFeatures.map((feature, index) => {
                    if (
                        index ===
                        (currArea == null ? store.currentArea : currArea)
                    ) {
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

    const removeField = (key, applyAll = true, currArea = null) => {
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
                    // For undo, if there was a currArea recorded
                    if (currArea) {
                        return index === currArea
                            ? { ...feature, fields: updatedFields }
                            : feature;
                    }

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
                    key === "colorA" ||
                    key === "colorB"
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

    useHotkeys("ctrl+z, ctrl+y", (_, handler) => {
        handleKeyboardShortcuts();
    });

    /**
     * Handler for when the user clicks on the keyboard hotkeys for undo/redo
     */
    const handleKeyboardShortcuts = () => {
        setOpenSnackbar(true);
    };

    const handleUndo = () => {
        const step = getUndo();

        if (step == null) {
            return;
        }

        if (
            store.currentMap.mapType == "distributiveflowmap" &&
            step[0] == -1
        ) {
            // Undo field add when it is DFM (single field for single feature)
            removeField(step[1], false, step[3]);
            return;
        }

        if (
            store.currentMap.mapType == "distributiveflowmap" &&
            step[0] == -2
        ) {
            // Undo field delete when it is DFM (single field)
            addField(step[1], step[2], false, null, step[3]);
            return;
        }

      // Undo field add
        if (step[0] == -1) {
            removeField(step[1]);
            return;
        }
        // Undo field delete
        if (step[0] == -2) {
            addField(step[1], "", true, step[2]);
            return;
        }

        var updatedFeatures = features;

        if (step[1] == "longitude" || step[1] == "latitude") {
            updatedFeatures[step[0]].fields.immutable.center[step[1]] = step[2];
        } else if (step[1] == "colorA" || step[1] == "colorB") {
            for (let i = 0; i < updatedFeatures.length; i++) {
                updatedFeatures[i].fields.immutable.color[step[1]] = step[2];
            }
        } else if (step[1] == "byFeature") {
            for (let i = 0; i < updatedFeatures.length; i++) {
                updatedFeatures[i].fields.immutable[step[1]] = step[2];
            }
        } else if (step[1] == "name") {
            updatedFeatures[step[0]].fields.immutable[step[1]] = step[2];
        } else {
            updatedFeatures[step[0]].fields.mutable[step[1]] = step[2];
        }

        setFeatures(updatedFeatures);
        store.setGeoJsonFeatures(updatedFeatures);
    };
    const handleRedo = () => {
        const step = getRedo();

        if (step == null) {
            return;
        }

        // Redo field add
        if (step[0] == -1) {
            if (store.currentMap.mapType == "distributiveflowmap") {
                addField(step[1], step[2], false, null, step[3]);
                return;
            }

            addField(step[1], "");
            return;
        }
        // Redo field remove
        if (step[0] == -2) {
            removeField(step[1]);
            return;
        }

        var updatedFeatures = features;

        if (step[1] == "longitude" || step[1] == "latitude") {
            updatedFeatures[step[0]].fields.immutable.center[step[1]] = step[3];
        } else if (step[1] == "colorA" || step[1] == "colorB") {
            for (let i = 0; i < updatedFeatures.length; i++) {
                updatedFeatures[i].fields.immutable.color[step[1]] = step[3];
            }
        } else if (step[1] == "byFeature") {
            for (let i = 0; i < updatedFeatures.length; i++) {
                updatedFeatures[i].fields.immutable[step[1]] = step[3];
            }
        } else if (step[1] == "name") {
            updatedFeatures[step[0]].fields.immutable[step[1]] = step[3];
        } else {
            updatedFeatures[step[0]].fields.mutable[step[1]] = step[3];
        }

        setFeatures(updatedFeatures);
        store.setGeoJsonFeatures(updatedFeatures);
    };
    const handleAddField = () => {
        setCurrentModel("addfield");
    };

    const handleAddLine = () => {
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
                            label={
                                store.currentMap && !store.currentMap.published
                                    ? "Edit"
                                    : "Values"
                            }
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
                        <Tooltip title="Undo">
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
                        </Tooltip>
                    )}
                    {auth.loggedIn && (
                        <Tooltip title="Redo">
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
                        </Tooltip>
                    )}
                </Box>
            </Box>
        );
    };

    const commentSide = () => {
        if (!isPublished) {
            return (
                <Paper
                    elevation={1}
                    sx={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: theme.palette.background.paper,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            color: theme.palette.text.primary,
                            fontWeight: "bold",
                            width: "80%",
                        }}
                    >
                        Comments are not available until the map is published.
                    </Typography>
                </Paper>
            );
        }
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
                                disabled={!auth.loggedIn}
                                sx={{
                                    color: comment.upvotes.includes(
                                        auth.user && auth.user.userId
                                            ? auth.user.userId
                                            : "####"
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
                                disabled={!auth.loggedIn}
                                sx={{
                                    color: comment.downvotes.includes(
                                        auth.user && auth.user.userId
                                            ? auth.user.userId
                                            : "####"
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
        let tooltipTitleFirstInput = "";
        let tooltipTitleSecondInput = ""; // Default for second input
        if (store.currentMap) {
            if (store.currentMap.mapType === "choroplethmap") {
                tooltipTitleFirstInput = "Min Color";
                tooltipTitleSecondInput = "Max Color";
            } else if (store.currentMap.mapType === "pointmap") {
                tooltipTitleFirstInput = "In-fill Color";
                tooltipTitleSecondInput = "Border Color";
            } else if (store.currentMap.mapType === "3drectangle") {
                tooltipTitleFirstInput = "In-fill Color";
                tooltipTitleSecondInput = "Border Color";
            } else {
                tooltipTitleFirstInput = "Color 1";
                tooltipTitleSecondInput = "Color 2";
            }
        }

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
                                display: "flex",
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
                                disabled={
                                    store.currentMap &&
                                    store.currentMap.published
                                }
                            />
                        </Box>

                        {/* Mapping through other fields */}
                        {selectedFeature?.fields?.mutable &&
                            Object.entries(selectedFeature.fields.mutable).map(
                                ([key, value]) => (
                                    <Box key={key} sx={{ display: "flex" }}>
                                        <TextField
                                            type="number"
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
                                            sx={{
                                                width: "100%",
                                                mr: "10px",
                                                mt: "10px",
                                            }}
                                            disabled={
                                                store.currentMap &&
                                                store.currentMap.published
                                            }
                                        />
                                        <IconButton
                                            disabled={
                                                store.currentMap &&
                                                store.currentMap.published
                                            }
                                            onClick={() => {
                                                const match =
                                                    key.match(/^(\d+)_(.+)/);
                                                if (match) {
                                                    const values =
                                                        features[
                                                            store.currentArea
                                                        ].fields.mutable[key];
                                                    removeField(key, false);
                                                    addUndo([
                                                        -2,
                                                        key,
                                                        values,
                                                        store.currentArea,
                                                    ]);
                                                } else {
                                                    const values = features.map(
                                                        function (feature) {
                                                            return feature
                                                                .fields.mutable[
                                                                key
                                                            ];
                                                        }
                                                    );
                                                    removeField(key);
                                                    addUndo([-2, key, values]);
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
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            padding: theme.spacing(2),
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: "bold",
                            }}
                        >
                            {store.currentMap && store.currentMap.published
                                ? "Choose an area to view values"
                                : "Choose an area to edit"}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {auth.loggedIn && (
                            <Button
                                id={
                                    store.currentMap?.mapType ===
                                    "distributiveflowmap"
                                        ? "addLineBtn"
                                        : "addFieldBtn"
                                }
                                variant="contained"
                                color="primary"
                                onClick={
                                    store.currentMap.mapType ===
                                    "distributiveflowmap"
                                        ? handleAddLine
                                        : handleAddField
                                }
                                sx={{
                                    color: "black",
                                    bgcolor: theme.palette.secondary.main,
                                    width: "100%",
                                    mb: "10px",
                                }}
                                disabled={
                                    store.currentMap &&
                                    store.currentMap.published
                                }
                            >
                                {store.currentMap.mapType ===
                                "distributiveflowmap"
                                    ? "+ Add Line"
                                    : "+ Add Field"}
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
                                    bgcolor: theme.palette.background.default,
                                    boxShadow: 2,
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography>
                                        Advanced Editing Features
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {features[store.currentArea]?.fields
                                        ?.immutable &&
                                        store.currentMap.mapType !==
                                            "choroplethmap" &&
                                        features[store.currentArea].fields
                                            .immutable["center"] && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    mb: "5px",
                                                }}
                                            >
                                                <TextField
                                                    type="number"
                                                    label="Longitude"
                                                    value={
                                                        features[
                                                            store.currentArea
                                                        ].fields.immutable
                                                            .center.longitude
                                                    }
                                                    onChange={(e) =>
                                                        changeFieldValue(
                                                            "longitude",
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        setFocusedField(
                                                            "longitude"
                                                        )
                                                    }
                                                    sx={{ mr: "5px" }}
                                                    disabled={
                                                        store.currentMap &&
                                                        store.currentMap
                                                            .published
                                                    }
                                                />
                                                <TextField
                                                    type="number"
                                                    label="Latitude"
                                                    value={
                                                        features[
                                                            store.currentArea
                                                        ].fields.immutable
                                                            .center.latitude
                                                    }
                                                    onChange={(e) =>
                                                        changeFieldValue(
                                                            "latitude",
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        setFocusedField(
                                                            "latitude"
                                                        )
                                                    }
                                                    disabled={
                                                        store.currentMap &&
                                                        store.currentMap
                                                            .published
                                                    }
                                                    sx={{ ml: "5px" }}
                                                />
                                            </Box>
                                        )}
                                    {features[store.currentArea]?.fields
                                        ?.immutable &&
                                        [
                                            "radius",
                                            "scale",
                                            "weight",
                                            "color",
                                        ].map((key) => {
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
                                                                <Tooltip
                                                                    title={
                                                                        tooltipTitleFirstInput
                                                                    }
                                                                >
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
                                                                        disabled={
                                                                            store.currentMap &&
                                                                            store
                                                                                .currentMap
                                                                                .published
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip
                                                                    title={
                                                                        tooltipTitleSecondInput
                                                                    }
                                                                >
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
                                                                                      "colorB",
                                                                                      e,
                                                                                      true
                                                                                  )
                                                                                : changeFieldValue(
                                                                                      "colorB",
                                                                                      e
                                                                                  );
                                                                        }}
                                                                        onBlur={() =>
                                                                            setFocusedField(
                                                                                "colorB"
                                                                            )
                                                                        }
                                                                        sx={{
                                                                            ml: "5px",
                                                                        }}
                                                                        disabled={
                                                                            store.currentMap &&
                                                                            store
                                                                                .currentMap
                                                                                .published
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            <TextField
                                                                type="number"
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
                                                                sx={{
                                                                    mt: "10px",
                                                                    mb: "10px",
                                                                    width: "100%",
                                                                }}
                                                                disabled={
                                                                    store.currentMap &&
                                                                    store
                                                                        .currentMap
                                                                        .published
                                                                }
                                                            />
                                                        )}
                                                    </Box>
                                                )
                                            );
                                        })}
                                    {store.currentMap?.mapType ===
                                    "distributiveflowmap" ? (
                                        <Box></Box>
                                    ) : (
                                        <Box>
                                            <List
                                                component="nav"
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.background
                                                            .default,
                                                    borderRadius: 1,
                                                    boxShadow: 4,
                                                    mt: "10px",
                                                }}
                                            >
                                                <ListItem
                                                    aria-expanded={
                                                        handleChoroplethClick
                                                            ? "true"
                                                            : undefined
                                                    }
                                                    onClick={
                                                        handleChoroplethClick
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={`Select ${store.currentMap.mapType} by:`}
                                                        secondary={
                                                            store.byFeature
                                                                ? store.byFeature
                                                                : "Click to select a feature"
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                            <Menu
                                                anchorEl={anchorElChoropleth}
                                                open={Boolean(
                                                    anchorElChoropleth
                                                )}
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
                                                    const arr =
                                                        store.geojson?.features?.flatMap(
                                                            (feature) => {
                                                                if (
                                                                    feature
                                                                        ?.fields
                                                                        ?.mutable
                                                                ) {
                                                                    return Object.entries(
                                                                        feature
                                                                            .fields
                                                                            .mutable
                                                                    ).flatMap(
                                                                        ([
                                                                            key,
                                                                            value,
                                                                        ]) => {
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
                                                                    );
                                                                }
                                                                return null;
                                                            }
                                                        ) || [];
                                                    const hasNonNullItem =
                                                        arr.some(
                                                            (item) =>
                                                                item !== null
                                                        );
                                                    if (!hasNonNullItem) {
                                                        return (
                                                            <MenuItem disabled>
                                                                No fields to
                                                                select. Please
                                                                add a field with
                                                                value.
                                                            </MenuItem>
                                                        );
                                                    } else {
                                                        return arr;
                                                    }
                                                })()}
                                            </Menu>
                                        </Box>
                                    )}
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

            <Box key={comments.length} sx={{ gridColumn: "2", gridRow: "2" }}>
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
                    onClose={() => {
                        setCurrentModel("");
                        store.getMapById(store.currentMap._id);
                    }}
                />
            )}
            {currentModel === "addfield" && (
                <MUIAddFieldModal
                    open={currentModel === "addfield"}
                    onClose={() => setCurrentModel("")}
                    onNew={(newField) => addUndo(["-1", newField])}
                />
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="info"
                    sx={{ width: "100%" }}
                >
                    Commands CTRL+Z & CTRL+Y are disabled. Please use the
                    undo/redo buttons.
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default MapViewingPage;

// useEffect(() => {
//   if (store.geojson == null) {
//     store.getGeojson(id);
//   }
// }, [store.geojson, id]);
