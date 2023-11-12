import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, InputBase, Menu, MenuItem, Paper, InputAdornment, Button, IconButton, ListItemIcon, Select, TextField, Grid, Tabs, Tab } from '@mui/material';
import { ZoomIn, ZoomOut, Undo, Redo, Delete, KeyboardArrowDown } from '@mui/icons-material';


function MapViewingPage() {
    const [value, setValue] = useState('1');
    const [fields, setFields] = useState([
        { id: 1, text: 'Temperature', value: '' },
        { id: 2, text: 'Population', value: '' },
        { id: 3, text: 'GDP', value: '' },
    ]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
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
        // Handle export logic
    };
    const handlePublish = () => {
        // Handle publish logic
    };
    const handleComments = () => {
        // Handle comments logic
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
    const handleAddField = () => { }

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
                    bgcolor: '#15B5B0',
                    padding: '10px',
                    height: 'relative'
                }}
            >
                <Box>
                    <Button variant="contained" onClick={handleExport} sx={{ width: '100px', marginRight: '10px', backgroundColor: 'cyan', color: 'black' }}>
                        Export
                    </Button>
                    <Button variant="contained" onClick={handlePublish} sx={{ width: '100px', backgroundColor: 'cyan', color: 'black' }}>
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
                    display: 'flex',
                    justifyContent: 'flex-end',
                    bgcolor: '#F9BDC0',
                    padding: '4px',
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
    }


    const mapView = () => {
        return (
            <Box
                gridArea={'mapview'}
                sx={{
                    flex: '1',
                    width: '100%',
                    height: `calc(100vh - 56px)`,
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
            <Box
                gridArea={'sidebar'}
                sx={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between', // Adjust to space out elements
                    height: `100%`,
                    width: '100%', // Adjust the width as needed
                    padding: '10px',
                    backgroundColor: '#f0f0f0', // Set background color

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
                            backgroundColor: 'cyan'
                        }}
                    >
                        + Add Field
                    </Button>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%', // Ensure it takes up the full width
                        }}
                    >
                        <Typography sx={{ m: "5px" }}>Choropleth Map by:</Typography>
                        <Box sx={{ textAlign: 'right' }}>
                            <Button onClick={handleChoroplethClick} variant="contained" sx={{ color: "black", backgroundColor: "cyan" }}>
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
                gridTemplateColumns: '3fr 1fr', // 3:1 ratio for main content and sidebar
                // gridTemplateRows: '7vh auto', // Allocate 10vh for top bar, rest for content
                height: 'auto', // Ensure the total height is 100vh
                overflow: 'hidden' // Prevent any overflow
            }}
        >
            <Box sx={{ gridColumn: '1', gridRow: '1', textAlign: 'left' }}>{topLeft()}</Box>
            <Box sx={{ gridColumn: '2', gridRow: '1', textAlign: 'right' }}>{topRight()}</Box>
            <Box sx={{ gridColumn: '1', gridRow: '2' }}>{mapView()}</Box>
            <Box sx={{ gridColumn: '2', gridRow: '2' }}>{sideBar()}</Box>
        </Box>
    );

}

export default MapViewingPage;
