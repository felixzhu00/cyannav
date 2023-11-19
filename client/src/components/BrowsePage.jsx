import Map from './Map'
import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, InputBase, Menu, MenuItem, Paper, InputAdornment, Button, IconButton, ListItemIcon, FormControl, Select, Fab } from '@mui/material';
import { Search, KeyboardArrowDown, Home, Store, Add } from '@mui/icons-material';
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import MUICreateMapModal from './modals/MUICreateMapModal';
import MUIPublishMapModal from './modals/MUIPublishMapModal';
import MUIDeleteMapModal from './modals/MUIDeleteMapModal';
import MUIAddTagModal from './modals/MUIAddTagModal';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MapCard from './MapCard.jsx'

function BrowsePage() {
  const theme = useTheme();
  const isMediumOrSmaller = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorElSort, setAnchorElSort] = useState(null);
  const [anchorElOption, setAnchorElOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState('By Map Name');
  const [selectedSort, setSelectedSort] = useState('recent');
  const [currentModal, setCurrentModal] = useState('');
  const [activeItem, setActiveItem] = useState('My Maps');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchBy, setSearchBy] = useState('mapName'); // 'mapName' or 'username'
  const [sortBy, setSortBy] = useState('recent');


  // PAGE STUFF
  const [currentPage, setCurrentPage] = useState(1);
  const totalMaps = 10; // Total number of MapCards to display
  const mapsPerPage = 8; // Display 8 MapCards per page
  const numberOfPages = Math.ceil(totalMaps / mapsPerPage);
  // Calculate the range of MapCards for the current page
  const firstMapIndex = (currentPage - 1) * mapsPerPage;
  const lastMapIndex = firstMapIndex + mapsPerPage;
  const mapCardsToShow = Array.from({ length: mapsPerPage }, (_, index) => index + firstMapIndex).filter(index => index < totalMaps);


  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleClose = () => {
    setAnchorElSort(null);
    setAnchorElOption(null);
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  }

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const searchAndSort = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: isMediumOrSmaller ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '800px',
    }}>
      {/* Search Functionality */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        marginBottom: isMediumOrSmaller ? 2 : 0,
        width: isMediumOrSmaller ? '100%' : 'auto',
      }}>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: theme.palette.background.default
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={`Search by ${searchBy === 'mapName' ? 'Map Name' : 'Username'}...`}
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <Search />
          </IconButton>
        </Paper>
        <FormControl variant="outlined" sx={{ ml: 2 }}>
          <Select
            value={searchBy}
            onChange={handleSearchByChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Search By' }}
            sx={{ height: '50px' }}
          >
            <MenuItem value="mapName">Map Name</MenuItem>
            <MenuItem value="username">Username</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Sort Functionality */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
      }}>
        <Typography variant="h6" sx={{ mr: 2 }}>Sort By:</Typography>
        <FormControl variant="outlined" sx={{ width: 200 }}>
          <Select
            value={sortBy}
            onChange={handleSortByChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Sort By' }}
            sx={{ height: '50px' }}
          >
            <MenuItem value="recent">Recent</MenuItem>
            <MenuItem value="alphabetical-order">Alphabetical Order</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );



  return (
    <Box sx={{ p: 3, overflow: 'hidden', height: 'auto', bgcolor: theme.palette.background.paper }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{activeItem}</Typography>
      <Box sx={{ mt: '10px' }}>
        {searchAndSort()}
      </Box>

      <Fab color="primary" aria-label="add" sx={{ position: 'absolute', top: 150, right: 20 }}>
        <Add fontSize="large" />
      </Fab>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {mapCardsToShow.map((index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MapCard />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={numberOfPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default BrowsePage;