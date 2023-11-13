import React, { useState } from 'react';
import { IconButton, MenuList, ListItemText, Typography, Box, TextField, Menu, MenuItem, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { MoreVert, Publish } from '@mui/icons-material';
import logo from "../assets/map_sample.jpg"
import { useNavigate } from 'react-router-dom';

function Map(props) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [mapName, setMapName] = useState('NAME OF MAP');

    const [modal, setModal] = useState(props.modal);


    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (e) => {
        props.handleModal(e)
        setAnchorEl(null);
    };

    const handleNameClick = () => {
        setIsEditing(true);
        setAnchorEl(null);
    };

    const handleNameChange = (event) => {
        setMapName(event.target.value);
    };

    const handleNameBlur = () => {
        setIsEditing(false);
    };
    const handleClickMap = () => {
        navigate('/mapview');
    }

    return (
        <Card

            sx={{
                width: '100%', border: '1px solid', '&:hover': {
                    boxShadow: 8,
                },
            }}>
            <CardMedia
                onDoubleClick={handleClickMap}
                sx={{ height: 240 }}
                image={logo}
            />
            <CardContent
                sx={{
                    display: 'grid',
                    fontSize: 40,
                    position: 'fix',
                    bottom: 0,
                    p: 1,
                    ml: 2,
                    mr: 2,
                    gap: 1,
                    gridTemplateColumns: '8fr 8fr 1fr',
                    gridTemplateAreas: `"name name kebab"
                                "user user kebab"
                                "user user kebab"`,
                    borderRadius: 1,
                }}

            >
                {isEditing ? (
                    <TextField
                        hiddenLabel
                        size="small"
                        defaultValue="Small"
                        value={mapName}
                        onChange={handleNameChange}
                        onBlur={mapName.trim() !== '' ? handleNameBlur : undefined}
                        error={mapName.trim() === ''} // Set error to true if the field is empty
                        // helperText={mapName.trim() === '' ? 'Field cannot be empty' : ''}
                        // backgroundColor={'secondary.dark'}
                        autoFocus
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                handleNameBlur();
                                event.preventDefault();
                            }
                        }}
                    />
                ) : (
                    <Typography variant="h5" gridArea={'name'} onDoubleClick={handleNameClick}>
                        {mapName}
                    </Typography>)}
                {props.showPublish && (
                    <Publish
                        sx={{
                            position: 'relative',
                            top: 10,
                            right: 10,
                            fontSize: 50, // Adjust the size as needed
                        }}
                    />
                )}
                <Typography id="createdByUser" gridArea={'user'} variant="body2" color="text.secondary">
                    CREATED BY USER
                </Typography>
                <IconButton 
                    id="moreInfoMapIcon"
                    sx={{
                        display: 'flex',
                        gridArea: 'kebab',
                        justifyContent: 'center',
                        fontSize: 40,
                        p: 1,
                        ml: 2,
                        mr: 2,
                        border: 1,
                        borderRadius: 2,
                        width: 36,
                        // bgcolor: 'secondary.dark',
                        // '&:hover': {
                        //     backgroundColor: 'secondary.dark',
                        // },
                    }}
                    onClick={handleMenuOpen}>
                    <MoreVert />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuList>
                        <MenuItem onClick={() => handleNameClick}>
                            <ListItemText id="renameOption" primary="Rename" />
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuClose("addtag")}>
                            <ListItemText id="addTagOption" primary="Add Tag" />
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuClose("publish")}>
                            <ListItemText id="publishOption" primary="Publish" />
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuClose("duplicate")}>
                            <ListItemText id="duplicateOption" primary="Duplicate" />
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuClose("delete")}>
                            <ListItemText id="deleteOption" primary="Delete" />
                        </MenuItem>
                    </MenuList>
                </Menu>
            </CardContent>
        </Card>
    );
}


export default Map;
