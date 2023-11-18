import React, { useState } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import mapSample from '../assets/map_sample.jpg';

export default function MapCard() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{ maxWidth: isSmallScreen ? 300 : 'relative' }}>
            <Link to="/mapview" style={{ textDecoration: 'none' }}>
                <CardMedia
                    sx={{ height: 300, cursor: 'pointer' }}
                    image={mapSample}
                    title="mapImage"
                />
            </Link>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        NAME OF MAP
                    </Typography>
                    <IconButton onClick={handleClick}>
                        <MoreVert />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Rename</MenuItem>
                        <MenuItem onClick={handleClose}>Add Tag</MenuItem>
                        <MenuItem onClick={handleClose}>Publish</MenuItem>
                        <MenuItem onClick={handleClose}>Duplicate</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                    </Menu>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    By (OWNER)
                </Typography>
            </CardContent>
        </Card>
    );
}
