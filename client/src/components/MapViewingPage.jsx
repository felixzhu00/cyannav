import React, { useState, useRef, useEffect, useContext } from 'react';
import { MapContainer, GeoJSON } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import sha256 from 'crypto-js/sha256';
import { Typography, Box, Menu, MenuItem, Paper, Button, IconButton, TextField, Tabs, Tab, useTheme } from '@mui/material';
import { Undo, Redo, Delete, KeyboardArrowDown, ThumbUp, ThumbDown } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

import MUIExportMapModal from './modals/MUIExportMapModal'
import MUIPublishMapModal from './modals/MUIPublishMapModal'
import MUIAddFieldModal from './modals/MUIAddFieldModal'
import MUICommentModal from './modals/MUICommentModal'
import NavJSON from './NavJSON'
import usgeojson from '../assets/custom.geo.json'
import { GlobalStoreContext } from '../store'

function MapViewingPage() {
    const theme = useTheme(); // Use the theme
    const { store } = useContext(GlobalStoreContext);
    const { id } = useParams();


    const [value, setValue] = useState('1');
    const [fields, setFields] = useState([
        { id: 1, text: 'Temperature', value: '' },
        { id: 2, text: 'Population', value: '' },
        { id: 3, text: 'GDP', value: '' },
    ]);
    const [currentModel, setCurrentModel] = useState('');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [maptype, setMapType] = useState('Choropleth Map');

    const [choroplethOptions, setChoroplethOptions] = useState(fields.map((field) => field.text));
    const [selectedChoropleth, setSelectedChoropleth] = useState('');
    const [anchorElChoropleth, setAnchorElChoropleth] = useState(null);

    // const [geoJSON, setGeoJSON] = useState("")
    const [features, setFeatures] = useState([]);
    const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(-1);

    /**
     * Commenting constants and states
     */

    //Runs on initial load
    useEffect(() => {
        if (id != null) {
            store.getMapById(id);
        }
    }, [id]);

    useEffect(() => {
        if (store.currentMap != null) {
            setIsPublished(store.currentMap.published);
        }
    }, [store.currentMap]);

    useEffect(() => {
        if (store.geojson == null) {
            store.getGeojson(id);
        }
    }, [store.geojson, id]);

    // Creates state feature to be edited
    useEffect(() => {
        if (store.geojson && store.geojson.features) {
            const updatedFeatures = store.geojson.features.map(feature => ({
                ...feature,
                fields: {
                    name: feature.properties.admin,
                },
            }));
            setFeatures(updatedFeatures);
        }
    }, [store.geojson]);

    // Used for Indexing currentArea Feature in geojson array
    useEffect(() => {
        if (store && features.length !== 0) {
            const index = findFeatureIndexByName(features, store.currentArea);
            console.log(index)
            setSelectedFeatureIndex(index);
        }
    }, [features, store.currentArea]);

    // Temp way for now to add field, need a better way
    useEffect(() => {
        if (store && store.fieldString) {
            const key = store.fieldString;
            addField(key, "");
        }
    }, [store.fieldString]);


    // Find feature index by name
    const findFeatureIndexByName = (features, featureName) => {
        return features.findIndex(feature => feature.fields.name === featureName);
    };


    // Handler to add a new field to the selected feature
    const addField = (key, value) => {
        setFeatures(prevFeatures => {
            const updatedFeatures = prevFeatures.map(feature => ({
                ...feature,
                fields: {
                    ...feature.fields,
                    [key]: value,
                },
            }));
            return updatedFeatures;
        });
        store.setGeoJsonFeatures(features);
    };

    // Handler to remove a field from every feature
    const removeField = (key) => {
        setFeatures(prevFeatures => {
            const updatedFeatures = prevFeatures.map(feature => {
                const updatedFields = { ...feature.fields };
                delete updatedFields[key];
                return {
                    ...feature,
                    fields: updatedFields,
                };
            });
            return updatedFeatures;
        });
        store.setGeoJsonFeatures(features);
    };

    // Handler to change the value of a field in the selected feature
    const changeFieldValue = (key, newValue) => {
        setFeatures(prevFeatures => {
            if (selectedFeatureIndex === -1) {
                // Feature not found, do nothing or handle accordingly
                return prevFeatures;
            }

            const updatedFeatures = [...prevFeatures];
            const updatedFeature = {
                ...updatedFeatures[selectedFeatureIndex],
                fields: {
                    ...updatedFeatures[selectedFeatureIndex].fields,
                    [key]: newValue,
                },
            };
            updatedFeatures[selectedFeatureIndex] = updatedFeature;
            return updatedFeatures;
        });
        store.setGeoJsonFeatures(features);
    };



    const [comments, setComments] = useState([]); // Used to store comments
    const addComment = (newCommentText) => {
        const newComment = {
            text: newCommentText,
            timestamp: new Date().toISOString()
        };
        setComments([...comments, newComment]);
    };
    const commentBubbleStyle = { // Comment bubble styling
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[2],
        maxWidth: '90%',
    };

    /**
     * Like/Dislikes constants and states
     */

    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    /**
     * Handler functions
     */
    //update
    const handleInputChange = (id, value) => { // field numerical values
        console.log(id, value)
        const updatedFields = fields.map((field) =>
            field.id === id ? { ...field, value } : field
        );
        setFields(updatedFields);
    };

    //delete
    const handleDeleteField = (id) => { // when user deletes a field
        const updatedFields = fields.filter((field) => field.id !== id);
        setFields(updatedFields);
        setChoroplethOptions(updatedFields.map((field) => field.text));
    };

    const handleChoroplethClick = (event) => {
        setAnchorElChoropleth(event.currentTarget);
    };

    const handleChoroplethClose = () => {
        setAnchorElChoropleth(null);
    };

    const handleChoroplethSelect = (option) => {
        setSelectedChoropleth(option);
        handleChoroplethClose();
    };

    const handleExport = () => {
        setCurrentModel("export")
    };
    const handlePublish = () => {
        setCurrentModel("publish")
    };
    const handleComments = () => {
        setCurrentModel("comment")
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
        setCurrentModel("addfield")
    }

    const handleLike = async () => { // handles likes
        // TODO: Need to implement to save to DB as well as retrieve from it
        await store.likeMap(store.currentMap._id);

    };

    const handleDislike = async () => { // handles dislikes
        // TODO: Need to implement to save to DB as well as retrieve from it
        await store.dislikeMap(store.currentMap._id);
    };

    const topLeft = () => {
        return (
            <Box
                sx={{
                    boxSizing: 'border-box',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: theme.palette.primary.main, // Use theme color
                    padding: '10px',
                    boxShadow: 4,
                    zIndex: 1,
                    position: 'relative', // Ensure this element is positioned
                }}
            >
                {/* Left-aligned Buttons */}
                <Box sx={{ marginRight: 'auto' }}>
                    <Button variant="contained" onClick={handleExport} sx={{ width: '100px', marginRight: '10px', backgroundColor: theme.palette.secondary.main, color: 'black' }}>
                        Export
                    </Button>
                    <Button disabled={isPublished} variant="contained" onClick={handlePublish} sx={{ width: '100px', backgroundColor: theme.palette.secondary.main, color: 'black' }}>
                        Publish
                    </Button>
                </Box>

                {/* Right-aligned Icons with like/dislike counts */}
                <Box display="flex" alignItems="center"> {/* Ensure flex layout for this Box */}
                    <IconButton disabled={!isPublished} id="likeBtn" onClick={handleLike} sx={{ color: hasLiked ? 'black' : 'default' }}>
                        <ThumbUp />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{store.likes}</Typography> {/* Added margin for spacing */}

                    <IconButton disabled={!isPublished} id="dislikeBtn" onClick={handleDislike} sx={{ color: hasDisliked ? 'black' : 'default' }}>
                        <ThumbDown />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{store.dislikes}</Typography> {/* Added margin for spacing */}
                </Box>
            </Box>
        );
    };

    const topRight = () => {
        return (
            <Box
                gridArea={'topbar'}
                sx={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    bgcolor: theme.palette.primary.main, // Use theme color
                    padding: '4px',
                    boxShadow: 4,
                    height: '60px',
                    zIndex: 1, // Increased z-index
                    position: 'relative', // Ensure this element is positioned
                }}
            >
                <Box sx={{ width: '100%', height: "relative" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="fullWidth"
                        aria-label="edit-comment-tab-bar"
                    >
                        <Tab disabled={isPublished} id="editTab" sx={{ '&.Mui-selected': { color: 'black' } }} onClick={handleEdit} value="1" label="Edit" />
                        <Tab disabled={!isPublished} id="commentTab" sx={{ '&.Mui-selected': { color: 'black' } }} onClick={handleEdit} value="2" label="Comment" />
                    </Tabs>
                </Box>
            </Box>
        )
    };

    const leaflet = () => {
        const popupLabel = (country, layer) => {
            const name = country.properties.admin;
            layer.bindPopup(name);

            // This adds a tooltip directly on screen
            // Probably needs CSS to make it look batter.
            // layer.bindTooltip(name, {permanent: true, direction: "center", className: "my-labels"});
        }

        return (
            <MapContainer center={[50, 50]} zoom={2} style={{ height: '100%', width: '100%' }}>
                <GeoJSON key={sha256(usgeojson)} data={usgeojson} onEachFeature={popupLabel} />
            </MapContainer>

        )
    }

    const mapView = () => {
        return (
            <Box
                gridArea={'mapview'}
                sx={{
                    position: 'relative', // Position the container relatively
                    flex: '1',
                    width: '100%',
                    height: `calc(100vh - 121px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                {store.geojson && <NavJSON data={store.geojson} />}
                <Box sx={{
                    position: 'absolute', // Absolutely position the button container
                    bottom: 20, // Adjust as needed
                    left: 20, // Adjust as needed
                    zIndex: 1000, // Ensure it's above the map
                }}>
                    <IconButton
                        id="undoBtn"
                        sx={{
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '5px',
                            color: 'black',
                            margin: '0 5px 0 0',
                            border: '2px solid #ccc',
                            '&:hover': {
                                backgroundColor: '#CCCCCC',
                            },
                        }}
                        onClick={() => handleUndo()}
                    >
                        <Undo />
                    </IconButton>
                    <IconButton
                        id="redoBtn"
                        sx={{
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '5px',
                            color: 'black',
                            border: '2px solid #ccc',
                            '&:hover': {
                                backgroundColor: '#CCCCCC',
                            },
                        }}
                        onClick={() => handleRedo()}
                    >
                        <Redo />
                    </IconButton>
                </Box>
            </Box>
        );
    };

    const commentSide = () => {
        return (
            <Box
                sx={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    padding: '10px',
                    height: '100%',
                    width: '100%',
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Box>
                    {/* Map through the comments and display them */}
                    {comments.map((comment, index) => (
                        <Paper key={index} sx={commentBubbleStyle}>
                            <Typography variant="body1" key={index}>{comment.text}</Typography>
                            <Typography variant="caption" sx={{ display: 'block', marginTop: '5px' }}>
                                <Typography variant='caption'>Username</Typography><br></br>
                                {new Date(comment.timestamp).toLocaleString()}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        mt: 'auto', // This ensures the margin is applied to the top, pushing the button to the bottom
                        width: '100%', // Button takes full width of the sidebar
                        color: "black",
                        bgcolor: theme.palette.secondary.main
                    }}
                    onClick={handleComments} // Replace with your own event handler
                >
                    Add Comment
                </Button>
            </Box>
        );
    };

    const editBar = () => {

        const fieldEdit = () => {
            if (selectedFeatureIndex === -1) {
                return null;
            }

            const selectedFeature = features[selectedFeatureIndex];

            return (
                <>
                    {/* Box for 'name' field */}
                    <Box
                        key={'name'}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                        }}
                    >
                        <Box sx={{ alignSelf: 'center', marginRight: '10px' }}>
                            <Typography>Name:</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end' }}>
                            <TextField
                                value={selectedFeature.fields.name}
                                onChange={(e) => changeFieldValue('name', e.target.value)}
                            />
                            {/* No delete icon for 'name' */}
                        </Box>
                    </Box>

                    {/* Mapping through other fields */}
                    {Object.entries(selectedFeature.fields).map(([key, value]) => (
                        key !== 'name' && (
                            <Box
                                key={key}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                }}
                            >
                                <Box sx={{ alignSelf: 'center', marginRight: '10px' }}>
                                    <Typography>{key}:</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end' }}>
                                    <TextField
                                        value={value}
                                        onChange={(e) => changeFieldValue(key, e.target.value)}
                                    />
                                    <IconButton onClick={() => removeField(key)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Box>
                        )
                    ))}
                </>
            );
        };

        return (
            <Box
                gridArea={'editBar'}
                sx={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: `calc(100vh - 121px)`,
                    width: '100%',
                    padding: '10px',
                    boxShadow: 1,
                    bgcolor: theme.palette.background.paper,
                }}
            >
                {store.currentArea == null ?
                    <Typography variant='h6'>Choose an area to edit</Typography> :
                    <Box>{fieldEdit()}</Box>
                }

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '10px', // Adjust as needed
                    }}
                >
                    <Button
                        id="addFieldBtn"
                        variant="contained"
                        color="primary"
                        onClick={handleAddField}
                        sx={{
                            marginBottom: '10px',
                            color: 'black',
                            bgcolor: theme.palette.secondary.main,
                        }}
                    >
                        + Add Field
                    </Button>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Typography sx={{ m: '10px' }}>{maptype} by:</Typography>
                        <Box sx={{ textAlign: 'right' }}>
                            <Button
                                onClick={handleChoroplethClick}
                                variant="contained"
                                sx={{
                                    color: 'black',
                                    width: '150px',
                                    bgcolor: theme.palette.secondary.main,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <span>{selectedChoropleth}</span>
                                    <KeyboardArrowDown />
                                </Box>
                            </Button>
                            <Menu
                                anchorEl={anchorElChoropleth}
                                open={Boolean(anchorElChoropleth)}
                                onClose={handleChoroplethClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                {choroplethOptions.map((option) => (
                                    <MenuItem key={option} onClick={() => handleChoroplethSelect(option)}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    };
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr', // 3:1 ratio for main content and sidebar
                // gridTemplateRows: '7vh auto', // Allocate 10vh for top bar, rest for content
                height: 'auto', // Ensure the total height is 100vh
                overflow: 'hidden' // Prevent any overflow
            }}
        >
            <Box sx={{ gridColumn: '1', gridRow: '1', textAlign: 'left', paddingTop: '1px' }}>{topLeft()}</Box>
            <Box sx={{ gridColumn: '2', gridRow: '1', textAlign: 'right', paddingTop: '1px' }}>{topRight()}</Box>
            <Box sx={{ gridColumn: '1', gridRow: '2' }}>{mapView()}</Box>
            <Box sx={{ gridColumn: '2', gridRow: '2' }}>{value === '1' ? editBar() : commentSide()}</Box>
            {
                currentModel === 'export' && <MUIExportMapModal
                    open={currentModel === 'export'}
                    onClose={() => setCurrentModel("")} />
            }
            {
                currentModel === 'publish' && <MUIPublishMapModal
                    open={currentModel === 'publish'}
                    onClose={() => setCurrentModel("")} />
            }
            {
                currentModel === 'comment' && <MUICommentModal
                    open={currentModel === 'comment'}
                    onClose={() => setCurrentModel("")}
                    onAddComment={addComment} />
            }
            {
                currentModel === 'addfield' && <MUIAddFieldModal
                    open={currentModel === 'addfield'}
                    onClose={() => setCurrentModel("")} />
            }

        </Box >
    );

}

export default MapViewingPage;
