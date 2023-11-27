import { useState, useContext } from "react";
import { Box, Card, CardMedia, CardContent, Typography, IconButton, Menu, MenuItem, useMediaQuery, useTheme, TextField } from '@mui/material';
import { MoreVert, Publish } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import mapSample from '../assets/map_sample.jpg';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

export default function MapCard({ map }) {
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(map.title[0] || "Unnamed Map");
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChangeName = (event) => {
        setNewName(event.target.value);
    };

    const handleSubmitName = () => {
        setIsEditing(false);
        store.renameMap(map._id, newName);
        // TODO: Save name to backend!
    };

    const handleKebab = (option) => {
        switch (option) {
            // case "rename":
            //     setIsEditing(true);
            //     break;
            case "addTag":
                store.setCurrentModal("AddTagModal")
                break;
            case "publish":
                store.setCurrentModal("PublishMapModal", map._id)
                break;
            case "duplicate":
                store.duplicateMap(map._id);
                break;
            case "fork":
                //forks map

                break;
            case "fork":
                //forks map

                break;
            case "delete":
                store.setCurrentModal("DeleteMapModal", map._id)
                break;
            default:
                console.log(`${option} is incorrect`);
        }
        setAnchorEl(null);
    }

    return (
        <Card sx={{ maxWidth: isSmallScreen ? 300 : 'relative' }}>
            <Box sx={{ position: 'relative' }}>
                <Link id="mapImage" to="/mapview" style={{ textDecoration: 'none' }}>
                    <CardMedia
                        sx={{ height: 300, cursor: 'pointer' }}
                        image={mapSample}
                        title="mapImage"
                    />
                </Link>
                {true && (
                    <Publish sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: 'black',
                        fontSize: '50px'
                    }} />
                )}
            </Box>
            <CardContent sx={{ bgcolor: theme.palette.background.paper }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isEditing ? (
                        <TextField
                            autoFocus
                            value={newName}
                            onChange={handleChangeName}
                            onBlur={handleSubmitName}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmitName();
                                }
                            }}
                        />
                    ) : (
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            onDoubleClick={handleDoubleClick}
                            sx={{
                                maxWidth: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {newName}
                        </Typography>
                    )}
                    <IconButton onClick={handleClick}>
                        <MoreVert />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        {/* <MenuItem onClick={() => { handleKebab("rename") }}>Rename</MenuItem> */}
                        <MenuItem onClick={() => { handleKebab("addTag") }}>Add Tag</MenuItem>
                        <MenuItem onClick={() => { handleKebab("publish") }}>Publish</MenuItem>
                        <MenuItem onClick={() => { handleKebab("duplicate") }}>Duplicate</MenuItem>
                        <MenuItem onClick={() => { handleKebab("fork") }}>Fork</MenuItem>
                        <MenuItem onClick={() => { handleKebab("delete") }}>Delete</MenuItem>
                    </Menu>
                </Box>

                <Typography id="createdByUser" variant="body2" color="text.secondary">
                    By {map.user[0].username} {/* Replace with actual map owner's name */}
                </Typography>
            </CardContent>
        </Card>
    );
}
