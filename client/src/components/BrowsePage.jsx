
import Map from './Map'
import React, { useEffect, useState } from 'react';
import { Typography, Box, InputBase, Menu, MenuItem, Paper, InputAdornment, Button, IconButton, ListItemIcon, Select } from '@mui/material';
import { Search, KeyboardArrowDown, Home, Store, Add } from '@mui/icons-material';
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import MUICreateMapModal from './modals/MUICreateMapModal';
import MUIPublishMapModal from './modals/MUIPublishMapModal';
import MUIDeleteMapModal from './modals/MUIDeleteMapModal';

import MUIAddTagModal from './modals/MUIAddTagModal';

function BrowsePage() {
  const [anchorElSort, setAnchorElSort] = useState(null);
  const [anchorElOption, setAnchorElOption] = useState(null);

  const [selectedOption, setSelectedOption] = useState('By Map Name');
  const [selectedSort, setSelectedSort] = useState('recent');
  const [currentModel, setCurrentModel] = useState('');

  const [activeItem, setActiveItem] = useState('My Maps');

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
        gridTemplateAreas: `"searchbox searchoption"
                          "sorttext sortoption"`,
        gap: 2, p: 2
      }}>
        <Box gridArea={'searchbox'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Paper component="form" elevation={3} sx={{ display: 'flex', justifyContent: 'flex-end', width: '280px', margin: 0 }}>
            <InputBase
              fullWidth
              placeholder="Search"
              sx={{ paddingLeft: '10px' }}
              endAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </Paper>
        </Box>
        <Box gridArea={'sorttext'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography variant="body1" sx={{ textAlign: 'right' }}>Sort By:</Typography>
        </Box>

        <Box gridArea={'sortoption'} sx={{ textAlign: 'left' }}>
          <Button id="outerSortByMenuBtn" onClick={handleSortClick} variant="contained" sx={{ color: 'black', bgcolor: 'cyan' }}
          >
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
            <MenuItem id="recentSortSelect" onClick={() => handleSortSelect('recent')}>Recent</MenuItem>
            <MenuItem id="nameSortSelect" onClick={() => handleSortSelect('name')}>Name</MenuItem>
          </Menu>
        </Box>
        <Box gridArea={'searchoption'} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <Button id="outerMenuByName" onClick={handleOptionClick} variant="contained" sx={{ color: 'black', bgcolor: 'cyan' }}>
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
            <MenuItem id="byMapNameBtn" onClick={() => handleOptionSelect('By Map Name')}>By Map Name</MenuItem>
            <MenuItem id="byUsernameBtn" onClick={() => handleOptionSelect('By Username')}>By Username</MenuItem>
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
          height: '100%',
          gridTemplateAreas: `"side map map map map""side map map map map"`,
          gridTemplateColumns: '1fr 10fr 10fr 10fr 10fr',
          gridTemplateRows: '1fr 1fr',
          gap: 2,
        }}
      >
        <Box gridArea={"side"}>{sideBar()}</Box>
        <Map handleModal={(e) => setCurrentModel(e)} gridArea={"map"} />
        <Map handleModal={(e) => setCurrentModel(e)} gridArea={"map"} />
        <Map handleModal={(e) => setCurrentModel(e)} gridArea={"map"} />
        <Map handleModal={(e) => setCurrentModel(e)} gridArea={"map"} />
        <Map handleModal={(e) => setCurrentModel(e)} gridArea={"map"} />
        <Map handleModal={(e) => setCurrentModel(e)} gridArea={"map"} />
        <Map handleModal={(e) => setCurrentModel(e)} gridArea={"map"} />
        <Map handleModal={(e) => setCurrentModel(e)} gridArea={"map"} />
      </Box>
    )
  }

  const sideBar = () => {
    return (
      <Box
        sx={{
          width: '60px',
          height: '100%',
          backgroundColor: '#BCECE0', // Sidebar background color
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '100px', // Curved border on the right side
        }}
      >
        <IconButton
          sx={{ color: activeItem === 'My Maps' ? '#000000' : '#a5a5a5', fontSize: '45px', marginBottom: '10vh', }}
          onClick={() => handleClick('My Maps')}
        >
          <Home
            sx={{ fontSize: '45px', borderRadius: '50%', backgroundColor: activeItem === 'My Maps' ? '#00FFFF' : '#FFFFFF' }}
          />
        </IconButton>

        <IconButton
          id="marketplaceBtn"
          sx={{ color: activeItem === 'Marketplace' ? '#000000' : '#a5a5a5', fontSize: '45px', marginTop: '10vh' }}
          onClick={() => handleClick('Marketplace')}
        >
          <Store
            sx={{ fontSize: '45px', borderRadius: '50%', backgroundColor: activeItem === 'Marketplace' ? '#00FFFF' : '#FFFFFF', }}
          />
        </IconButton>
      </Box>
    );
  }



  return (
    <Box
      sx={{
        height: `calc(100vh - 161px)`,
        display: 'grid',
        gridTemplateColumns: '10fr 10fr',
        gridTemplateRows: '1fr 10fr 1fr',
        gridTemplateAreas: `"title searchsort"
                          "mapdisplay mapdisplay"
                          "page page"
                          `,
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        gap: 2, p: 2
      }}



    >

      <Typography variant="h1" sx={{ fontWeight: '900' }} gridArea={'title'}>{activeItem}</Typography>
      <Box gridArea={'mapdisplay'}>
        {mapGrid()}
      </Box>
      <Box gridArea={'searchsort'}>{searchAndSort()}</Box>

      <Box gridArea={'page'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Pagination
          count={10}
          page={currentPage}
          onChange={(event, page) => handlePageChange(page)}
          renderItem={(item) => (
            <PaginationItem
              component={Button}
              onClick={() => handlePageChange(item.page)}
              {...item}
            />
          )}
        />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '100px', right: '100px' }}>
        <IconButton
          id="createMapOuterBtn"
          sx={{ borderRadius: '50%', backgroundColor: '#ADD8E6' }}
          onClick={() => setCurrentModel("create")}
        >
          <Add sx={{ fontSize: '100px' }} />
        </IconButton>
      </Box>


      {currentModel === 'create' && <MUICreateMapModal
        open={currentModel === 'create'}
        onClose={() => setCurrentModel("")} />}
      {currentModel === 'addtag' && <MUIAddTagModal
        open={currentModel === 'addtag'}
        onClose={() => setCurrentModel("")} />}
      {currentModel === 'publish' && <MUIPublishMapModal
        open={currentModel === 'publish'}
        onClose={() => setCurrentModel("")} />}
      {currentModel === 'delete' && <MUIDeleteMapModal
        open={currentModel === 'delete'}
        onClose={() => setCurrentModel("")} />}
    </Box >
  );
}

export default BrowsePage;

