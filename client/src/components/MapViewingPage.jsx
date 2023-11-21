import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import sha256 from 'crypto-js/sha256';
import { Typography, Box, Menu, MenuItem, Paper, Button, IconButton, TextField, Tabs, Tab, useTheme } from '@mui/material';
import { Undo, Redo, Delete, KeyboardArrowDown, ThumbUp, ThumbDown } from '@mui/icons-material';

import MUIExportMapModal from './modals/MUIExportMapModal'
import MUIPublishMapModal from './modals/MUIPublishMapModal'
import MUIAddFieldModal from './modals/MUIAddFieldModal'
import MUICommentModal from './modals/MUICommentModal'

import hardcodegeojson from '../assets/South Korea.geo.json'

function MapViewingPage() {
    const theme = useTheme(); // Use the theme

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

    /**
     * Commenting constants and states
     */
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
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);


    /**
     * Handler functions
     */
    const handleInputChange = (id, value) => { // field numerical values
        const updatedFields = fields.map((field) =>
            field.id === id ? { ...field, value } : field
        );
        setFields(updatedFields);
    };


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

    const handleLike = () => { // handles likes
        // TODO: Need to implement to save to DB as well as retrieve from it
        if (hasLiked) {
            // If already liked, unlike it
            setLikes(likes - 1);
            setHasLiked(false);
        } else {
            // Like and remove dislike if it was disliked before
            setLikes(likes + 1);
            setHasLiked(true);
            if (hasDisliked) {
                setDislikes(dislikes - 1);
                setHasDisliked(false);
            }
        }
    };

    const handleDislike = () => { // handles dislikes
        // TODO: Need to implement to save to DB as well as retrieve from it
        if (hasDisliked) {
            // If already disliked, undislike it
            setDislikes(dislikes - 1);
            setHasDisliked(false);
        } else {
            // Dislike and remove like if it was liked before
            setDislikes(dislikes + 1);
            setHasDisliked(true);
            if (hasLiked) {
                setLikes(likes - 1);
                setHasLiked(false);
            }
        }
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
                    <Button variant="contained" onClick={handlePublish} sx={{ width: '100px', backgroundColor: theme.palette.secondary.main, color: 'black' }}>
                        Publish
                    </Button>
                </Box>

                {/* Right-aligned Icons with like/dislike counts */}
                <Box display="flex" alignItems="center"> {/* Ensure flex layout for this Box */}
                    <IconButton id="likeBtn" onClick={handleLike} sx={{ color: hasLiked ? 'black' : 'default' }}>
                        <ThumbUp />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{likes}</Typography> {/* Added margin for spacing */}

                    <IconButton id="dislikeBtn" onClick={handleDislike} sx={{ color: hasDisliked ? 'black' : 'default' }}>
                        <ThumbDown />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{dislikes}</Typography> {/* Added margin for spacing */}
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
                        <Tab id="editTab" sx={{ '&.Mui-selected': { color: 'black' } }} onClick={handleEdit} value="1" label="Edit" />
                        <Tab id="commentTab" sx={{ '&.Mui-selected': { color: 'black' } }} onClick={handleEdit} value="2" label="Comment" />
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
                <GeoJSON key={sha256(hardcodegeojson)} data={hardcodegeojson} onEachFeature={popupLabel} />
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
                {leaflet()}
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
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant='h6'>Chosen Map Type:</Typography>
                        <Typography sx={{ marginBottom: "20px" }}>{maptype}</Typography>
                    </Box>
                    {fields.map((field) => (
                        <Box
                            key={field.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '10px',
                            }}
                        >
                            <Box sx={{ alignSelf: 'center', marginRight: '10px' }}><Typography>{field.text}:</Typography></Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end' }}>
                                <TextField
                                    value={field.value}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                />
                                <IconButton onClick={() => handleDeleteField(field.id)}>
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>

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
                            bgcolor: theme.palette.secondary.main
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
                        <Typography sx={{ m: "10px" }}>{maptype} by:</Typography>
                        <Box sx={{ textAlign: 'right' }}>
                            <Button
                                onClick={handleChoroplethClick}
                                variant="contained"
                                sx={{
                                    color: "black",
                                    width: '150px',
                                    bgcolor: theme.palette.secondary.main
                                }}>
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
