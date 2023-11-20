import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, InputBase, Menu, MenuItem, Paper, InputAdornment, Button, IconButton, ListItemIcon, Select, TextField, Grid, Tabs, Tab, useTheme } from '@mui/material';
import { ZoomIn, ZoomOut, Undo, Redo, Delete, KeyboardArrowDown, ThumbUp, ThumbDown } from '@mui/icons-material';

import MUIExportMapModal from './modals/MUIExportMapModal'
import MUIPublishMapModal from './modals/MUIPublishMapModal'
import MUIAddFieldModal from './modals/MUIAddFieldModal'
import MUICommentModal from './modals/MUICommentModal'

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
    const handleZoomIn = () => {
        // Handle edit logic
    };
    const handleZoomOut = () => {
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
                    <IconButton onClick={handleLike} sx={{ color: hasLiked ? 'black' : 'default' }}>
                        <ThumbUp />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{likes}</Typography> {/* Added margin for spacing */}

                    <IconButton onClick={handleDislike} sx={{ color: hasDisliked ? 'black' : 'default' }}>
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
                    boxShadow: 4
                }}
            >
                <Box sx={{ width: '100%', height: "relative" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="fullWidth"
                        aria-label="edit-comment-tab-bar"
                    >
                        <Tab sx={{ '&.Mui-selected': { color: 'black' } }} onClick={handleEdit} value="1" label="Edit" />
                        <Tab sx={{ '&.Mui-selected': { color: 'black' } }} onClick={handleEdit} value="2" label="Comment" />
                    </Tabs>
                </Box>
            </Box>
        )
    };

    const mapView = () => {
        return (
            <Box
                gridArea={'mapview'}
                sx={{
                    flex: '1',
                    width: '100%',
                    height: `calc(100vh - 121px)`,
                    backgroundColor: '#87CEEB',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between', // Add space between children
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'left', marginTop: '20px', marginLeft: '20px' }}>
                    <IconButton
                        sx={{
                            backgroundColor: '#28282B',
                            padding: '10px',
                            borderRadius: '5px',
                            color: 'white',
                            margin: '0 5px 0 0', // Add margin to the right for spacing
                            border: '2px solid white', // Solid border
                            '&:hover': {
                                backgroundColor: '#28282B', // Set the background to transparent on hover
                            },
                        }}
                        onClick={() => console.log(handleZoomIn)}
                    >
                        <ZoomIn />
                    </IconButton>
                    <IconButton
                        sx={{
                            backgroundColor: '#28282B',
                            padding: '10px',
                            borderRadius: '5px',
                            color: 'white',
                            border: '2px solid white', // Solid border
                            '&:hover': {
                                backgroundColor: '#28282B', // Set the background to transparent on hover
                            },
                        }}
                        onClick={() => console.log(handleZoomOut)}
                    >
                        <ZoomOut />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'left', marginBottom: '20px', marginLeft: '20px' }}>
                    <IconButton
                        sx={{
                            backgroundColor: '#28282B',
                            padding: '10px',
                            borderRadius: '5px',
                            color: 'white',
                            margin: '0 5px 0 0', // Add margin to the right for spacing
                            border: '2px solid white', // Solid border
                            '&:hover': {
                                backgroundColor: '#28282B', // Set the background to transparent on hover
                            },
                        }}
                        onClick={() => console.log(handleUndo)}
                    >
                        <Undo />
                    </IconButton>
                    <IconButton
                        sx={{
                            backgroundColor: '#28282B',
                            padding: '10px',
                            borderRadius: '5px',
                            color: 'white',
                            border: '2px solid white', // Solid border
                            '&:hover': {
                                backgroundColor: '#28282B', // Set the background to transparent on hover
                            },
                        }}
                        onClick={() => console.log(handleRedo)}
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
                        bgcolor: "cyan"
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
                                    bgcolor: theme.palette.secondary.main,
                                    width: '150px'
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
