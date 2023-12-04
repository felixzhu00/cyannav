import { useState, useContext, useEffect } from "react";
import { Box, Card, CardMedia, CardContent, Typography, IconButton, Menu, MenuItem, useMediaQuery, useTheme, TextField, Chip, Stack, Tooltip, ListItem } from '@mui/material';
import { MoreVert, Publish } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import usgeojsonpng from "../assets/usgeojson.png"
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'


export default function MapCard({ map }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(map.title[0] || "Unnamed Map");
    const [isPublished, setIsPublished] = useState(map.published);
    // States for managing chips
    const [visibleChips, setVisibleChips] = useState([]);
    const [noTagMessage, setNoTagMessage] = useState("");


    // Define the maximum length for a chip label
    const MAX_CHIP_LABEL_LENGTH = 10;

    const showChips = () => {
        if (map.tags.length != 0) {
            setVisibleChips(map.tags);
        } else {
            setNoTagMessage("No tags associated with map");
        }
    };

    // Effect to calculate chips on mount and when map changes
    useEffect(() => {
        showChips();
    }, [map.tags, isSmallScreen]);

    useEffect(() => {
        setIsPublished(map.published);
    }, [map.published]);

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
    };

    const handleKebab = async (option) => {
        switch (option) {
            case "addTag":
                await store.setCurrentModal("AddTagModal", map._id)
                break;
            case "publish":
                await store.setCurrentModal("PublishMapModal", map._id)
                break;
            case "duplicate":
                await store.duplicateMap(map._id);
                await store.getMyMapCollection(auth.user.userId);
                break;
            case "fork":
                //forks map

                break;
            case "delete":
                await store.setCurrentModal("DeleteMapModal", map._id)
                break;
            default:
                console.log(`${option} is incorrect`);
        }
        setAnchorEl(null);
    }

    const handleNavToMap = () => {
        store.setCurrentMap(map)
    }

    return (
        <Card sx={{ maxWidth: isSmallScreen ? 300 : 'relative', height: '100%' }}>
            <Box sx={{ position: 'relative' }}>
                <Link id="mapImage" to="/mapview" onClick={handleNavToMap} style={{ textDecoration: 'none' }}>
                    <CardMedia
                        sx={{ height: 300, cursor: 'pointer' }}
                        image={usgeojsonpng}
                        title="mapImage"
                    />
                </Link>
                {isPublished && (
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
                        <MenuItem disabled={isPublished} onClick={() => { handleKebab("addTag") }}>Add Tag</MenuItem>
                        <MenuItem disabled={isPublished} onClick={() => { handleKebab("publish") }}>Publish</MenuItem>
                        <MenuItem onClick={() => { handleKebab("duplicate") }}>Duplicate</MenuItem>
                        {/* <MenuItem onClick={() => { handleKebab("fork") }}>Fork</MenuItem> */}
                        <MenuItem onClick={() => { handleKebab("delete") }}>Delete</MenuItem>
                    </Menu>
                </Box>

                <Typography id="createdByUser" variant="body2" color="text.secondary">
                    By {map.user[0].username}
                </Typography>
                <Box sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                    <Stack direction="row" spacing={1} sx={{ mt: '10px', flexWrap: 'nowrap' }}>
                        {visibleChips.map((tag) => {
                            const isLongLabel = tag.length > MAX_CHIP_LABEL_LENGTH;
                            const displayLabel = isLongLabel
                                ? `${tag.substring(0, MAX_CHIP_LABEL_LENGTH)}...`
                                : tag;

                            return (
                                <Tooltip key={tag} title={tag} placement="top" arrow>
                                    <Chip label={displayLabel} size="small" />
                                </Tooltip>
                            );
                        })}
                    </Stack>
                </Box>

                {map.tags.length === 0 && (
                    <Typography variant='subtitle2'>
                        {noTagMessage}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
