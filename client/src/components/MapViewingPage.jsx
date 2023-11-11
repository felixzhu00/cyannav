import React, { useState } from 'react';
import { Typography, Box, InputBase, Menu, MenuItem, Paper, InputAdornment, Button, IconButton, ListItemIcon, Select } from '@mui/material';
import { Search, KeyboardArrowDown, Home, Store } from '@mui/icons-material';


function MapViewingPage() {
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

    const topBar = () => {
        return (
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    bgcolor: 'primary.light', // Adjust the background color as needed
                    padding: '10px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
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
                <Box sx={{ m: '2px' }}>
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


    return (
        <>
        {topBar()}
        </>
    );
}

export default MapViewingPage;
