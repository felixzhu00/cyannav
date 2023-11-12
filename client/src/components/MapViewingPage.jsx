import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, InputBase, Menu, MenuItem, Paper, InputAdornment, Button, IconButton, ListItemIcon, Select, TextField, Grid } from '@mui/material';
import { ZoomIn, ZoomOut, Undo, Redo, Delete, KeyboardArrowDown, SecurityUpdateWarningRounded } from '@mui/icons-material';
import MUIExportMapModal from './modals/MUIExportMapModal'
import MUIPublishMapModal from './modals/MUIPublishMapModal'
import MUIAddFieldModal from './modals/MUIAddFieldModal'
import MUICommentModal from './modals/MUICommentModal'

function MapViewingPage() {

    const [fields, setFields] = useState([
        { id: 1, text: 'Temperature', value: '' },
        { id: 2, text: 'Population', value: '' },
        { id: 3, text: 'GDP', value: '' },
    ]);
    const [currentModel, setCurrentModel] = useState('');
    const [maptype, setMapType] = useState('Choropleth Map')

    const [choroplethOptions, setChoroplethOptions] = useState(fields.map((field) => field.text));
    const [selectedChoropleth, setSelectedChoropleth] = useState('');
    const [anchorElChoropleth, setAnchorElChoropleth] = useState(null);

    const handleInputChange = (id, value) => {
        const updatedFields = fields.map((field) =>
            field.id === id ? { ...field, value } : field
        );
        setFields(updatedFields);
    };

    const handleDeleteField = (id) => {
        // Implement your logic to delete a field
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

    const topLeft = () => {
        return (
            <Box
                gridArea={'topbar'}
                sx={{
                    boxSizing: 'border-box',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    bgcolor: 'primary.light', // Adjust the background color as needed
                    padding: '10px',
                }}
            >
                <Box>
                    <Button variant="contained" onClick={handleExport} sx={{ width: '100px' }}>
                        Export
                    </Button>
                    <Button variant="contained" onClick={handlePublish} sx={{ width: '100px', marginRight: '10px' }}>
                        Publish
                    </Button>
                </Box>
            </Box>
        )
    }
    const topRight = () => {
        return (
            <Box
                gridArea={'topbar'}
                sx={{
                    boxSizing: 'border-box',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    bgcolor: 'primary.light', // Adjust the background color as needed
                    padding: '10px',
                }}
            >
                <Box>
                    <Button variant="contained" onClick={handleComments} sx={{ width: '100px', marginLeft: '0px' }}>
                        Comments
                    </Button>
                    <Button variant="contained" onClick={handleEdit} sx={{ width: '100px', marginLeft: '0px' }}>
                        Edit
                    </Button>
                </Box>
            </Box>
        )
    }


    const mapView = () => {
        return (
            <Box
                gridArea={'mapview'}
                sx={{
                    flex: '1',
                    width: '100%',
                    height: `calc(100vh - 61px)`,
                    backgroundColor: '#87CEEB', // Light blue color
                    // position: 'relative', // You can remove this line
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

    }


    const textBox = () => {
        <Box
            sx={{
                width: '400px', // Adjust the width as needed
                padding: '10px',
                backgroundColor: '#f0f0f0', // Set background color
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100vh', // Adjust the height as needed
                overflowY: 'auto', // Add vertical scroll if needed
            }}
        >
            {fields.map((field) => (
                <Box
                    key={field.id}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between', // Adjust as needed
                        marginBottom: '10px',
                    }}
                >
                    <Box sx={{ alignSelf: 'center', marginRight: '10px' }}>{field.text}:</Box>
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
    }


    const sideBar = () => {
        return (
            <Box gridArea={'sidebar'}
                sx={{
                    boxSizing: 'border-box',
                    height: `100%`,
                    width: '100%', // Adjust the width as needed
                    padding: '10px',
                    backgroundColor: '#f0f0f0', // Set background color
                    top: '60px', // Adjust the top value based on the height of your topBar
                    right: 0,
                    bottom: 0, // Make the bottom touch the bottom of the screen
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >

                    <Typography>Chosen Map Type</Typography>
                    <Typography>{maptype}</Typography>
                </Box>
                {fields.map((field) => (
                    <Box
                        key={field.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between', // Adjust as needed
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

                <Box
                    sx={{ position: 'relative', bottom: '-60vh' }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddField}
                        sx={{
                            marginTop: 'auto',
                            marginLeft: '50%',
                            transform: 'translateX(-50%)',

                        }}
                    >
                        +Add Field
                    </Button>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                        }}
                    >
                        <Typography>Choropleth Map by:</Typography>
                        <Box sx={{ textAlign: 'right' }}>
                            <Button onClick={handleChoroplethClick} variant="contained">
                                {selectedChoropleth}<KeyboardArrowDown />
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
    }
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr', // Adjust the ratio as needed
                gridTemplateRows: 'auto 1fr',
            }}
        >
            <Box sx={{ gridColumn: '1', gridRow: '1', textAlign: 'left' }}>{topLeft()}</Box>
            <Box sx={{ gridColumn: '2', gridRow: '1', textAlign: 'right' }}>{topRight()}</Box>
            <Box sx={{ gridColumn: '1', gridRow: '2' }}>{mapView()}</Box>
            <Box sx={{ gridColumn: '2', gridRow: '2' }}>{sideBar()}</Box>
            {currentModel === 'export' && <MUIExportMapModal
                open={currentModel === 'export'}
                onClose={() => setCurrentModel("")} />}
            {currentModel === 'publish' && <MUIPublishMapModal
                open={currentModel === 'publish'}
                onClose={() => setCurrentModel("")} />}
            {currentModel === 'comment' && <MUICommentModal
                open={currentModel === 'comment'}
                onClose={() => setCurrentModel("")} />}
            {currentModel === 'addfield' && <MUIAddFieldModal
                open={currentModel === 'addfield'}
                onClose={() => setCurrentModel("")} />}
            
        </Box>
    );

}

export default MapViewingPage;
