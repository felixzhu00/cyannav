import { useState, useContext } from "react";
import { Box, Card, CardMedia, CardContent, Typography, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { MoreVert, StoreTwoTone } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import mapSample from '../assets/map_sample.jpg';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

export default function MapCard() {
    const { store } = useContext(GlobalStoreContext);
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

    const handleKebab = (option) => {
        switch (option) {
            case "rename":
                break;
            case "addTag":
                store.setCurrentModal("AddTagModal")
                break;
            case "publish":
                store.setCurrentModal("PublishMapModal")
                break;
            case "duplicate":
                //duplicates map                

                break;
            case "delete":
                store.setCurrentModal("DeleteMapModal")
                break;
            default:
                console.log(`${option} is incorrect`);
        }
        setAnchorEl(null);
    }

    return (
        <Card sx={{ maxWidth: isSmallScreen ? 300 : 'relative' }}>
            <Link to="/mapview" style={{ textDecoration: 'none' }}>
                <CardMedia
                    sx={{ height: 300, cursor: 'pointer' }}
                    image={mapSample}
                    title="mapImage"
                />
            </Link>
            <CardContent sx={{ bgcolor: theme.palette.background.paper }}>
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
                        <MenuItem onClick={() => { handleKebab("rename") }}>Rename</MenuItem>
                        <MenuItem onClick={() => { handleKebab("addTag") }}>Add Tag</MenuItem>
                        <MenuItem onClick={() => { handleKebab("publish") }}>Publish</MenuItem>
                        <MenuItem onClick={() => { handleKebab("duplicate") }}>Duplicate</MenuItem>
                        <MenuItem onClick={() => { handleKebab("delete") }}>Delete</MenuItem>
                    </Menu>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    By (OWNER)
                </Typography>
            </CardContent>
        </Card>
    );
}
