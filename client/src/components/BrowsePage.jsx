
import Map from './Map'
import React, { useState } from 'react';
import { Typography, Box, InputBase, Menu, MenuItem, Paper, InputAdornment, Button, IconButton, ListItemIcon, Select } from '@mui/material';
import { Search, KeyboardArrowDown, Home, Store } from '@mui/icons-material';

function BrowsePage() {
  const [anchorElSort, setAnchorElSort] = React.useState(null);
  const [anchorElOption, setAnchorElOption] = React.useState(null);

  const [selectedOption, setSelectedOption] = React.useState('By Map Name');
  const [selectedSort, setSelectedSort] = React.useState('recent');

  const [activeItem, setActiveItem] = useState('MyMaps');

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const handleOptionClick = (event) => {
    setAnchorElOption(event.currentTarget);
  };

  const handleSortClick = (event) => {
    setAnchorElSort(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElSort(null);
    setAnchorElOption(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    handleClose();
  };

  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption);
    handleClose();
  };


  const searchAndSort = () => {
    return (
      <Box sx={{
        justifyContent: 'flex-end',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, min-content)',
        gridTemplateAreas: `"searchtext searchbox searchoption"
                          ". sorttext sortoption"`,
        gap: 2, p: 2
      }}>
        <Typography gridArea={'searchtext'} sx={{ textAlign: 'right' }}>Search</Typography>
        <Typography gridArea={'sorttext'} sx={{ textAlign: 'right' }}>Sort By</Typography>
        <Box gridArea={'searchbox'} sx={{ textAlign: 'right' }}>
          <Paper component="form" elevation={3} sx={{ display: 'flex', justifyContent: 'flex-end', width: '280px', margin: 0 }}>
            <InputBase
              fullWidth
              placeholder="Search"
              endAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </Paper>
        </Box>

        <Box gridArea={'sortoption'} sx={{ textAlign: 'right' }}>
          <Button onClick={handleSortClick} variant="contained">
            {selectedSort}<KeyboardArrowDown />
          </Button>
          <Menu
            anchorEl={anchorElSort}
            open={Boolean(anchorElSort)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={() => handleSortSelect('recent')}>Recent</MenuItem>
            <MenuItem onClick={() => handleSortSelect('name')}>Name</MenuItem>
          </Menu>
        </Box>
        <Box gridArea={'searchoption'} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <Button onClick={handleOptionClick} variant="contained">
            {selectedOption}<KeyboardArrowDown />
          </Button>
          <Menu
            anchorEl={anchorElOption}
            open={Boolean(anchorElOption)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={() => handleOptionSelect('By Map Name')}>By Map Name</MenuItem>
            <MenuItem onClick={() => handleOptionSelect('By Username')}>By Username</MenuItem>
          </Menu>
        </Box>
      </Box>
    )
  }

  const mapGrid = () => {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
        }}
      >
        <Map />
        <Map />
        <Map />
        <Map />
        <Map />
        <Map />
        <Map />
        <Map />
      </Box>
    )
  }

  const sideBar = () => {
    return (
      <Box
        sx={{
          width: '80px',
          height: '70vh',
          backgroundColor: '#3f51b5', // Sidebar background color
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0 10px 10px 0', // Curved border on the right side
        }}
      >
        <IconButton
          sx={{ color: activeItem === 'MyMaps' ? '#fff' : '#a5a5a5', fontSize: '38px', marginBottom: '10vh',  }}
          onClick={() => handleClick('MyMaps')}
        >
          <Home 
          sx={{fontSize: '38px', borderRadius: '50%', backgroundColor: '#ADD8E6'}}
          />
        </IconButton>

        <IconButton
          sx={{ color: activeItem === 'MarketPlace' ? '#fff' : '#a5a5a5', fontSize: '38px', marginTop: '10vh' }}
          onClick={() => handleClick('MarketPlace')}
        >
          <Store 
          sx={{fontSize: '38px',  borderRadius: '50%', backgroundColor: '#ADD8E6'}}
          />
        </IconButton>
      </Box>
    );
  }



  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, min-content)',
          gridTemplateAreas: `"togglemenu title searchsort"
                          "togglemenu mapdisplay mapdisplay"`,
          gap: 2, p: 2
        }}
      >


        <Typography gridArea={'title'}>My Maps</Typography>

        <Box gridArea={'mapdisplay'}>{mapGrid()}</Box>
        <Box gridArea={'searchsort'}>{searchAndSort()}</Box>
        <Box gridArea={'togglemenu'}>{sideBar()}</Box>
      </Box>

    </>

  );
}

export default BrowsePage;
