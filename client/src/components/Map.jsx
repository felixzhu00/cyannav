import '../App.css';
import React from 'react';
import { IconButton, MenuList, ListItemText, Typography, Box, TextField } from '@mui/material';
import { More, MoreVert, Publish} from '@mui/icons-material';

function Map() {
  return (
    <div class="map-container">
        <div class="map-image"><p>Map</p></div>
        <div class="map-util">
            <div class="map-text">
                <p class="map-name">NAME OF MAP</p>
                <p class="map-user">CREATE BY USER</p>
            </div>
            <div class="kebab-container">
                <MoreVert class="kebab-icon" ></MoreVert>
            </div>
        </div>
        
    </div>
  );
}


// <IconButton/> - Kaba button
    // <MenuList></MenuList> - menu list
    // <ListItemText></ListItemText> - menun list item
    // <Typography></Typography> - text
    // <Box></Box> - div
    // <TextField></TextField> - rename
    // <MoreVert></MoreVert> - dot icon
    // <Publish></Publish> - upload icon

    // <>
    {/* <Box class="map-container">
        <d class="map-image"><p>Map</p></div>
        <Box class=><Typography class="map-name">NAME OF MA</Typography>
        <Typography class="map-user">CREATE BY USER</Typography></Box>
        <MoreVert></MoreVert>


    </Box> */}
    
    {/* </> */}
    
export default Map;
