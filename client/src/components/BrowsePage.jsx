import { useState, useContext, useEffect } from "react";
import { Typography, Grid, Box, InputBase, Menu, MenuItem, Paper, InputAdornment, Button, IconButton, ListItemIcon, FormControl, Select, Fab } from '@mui/material';
import { Search, KeyboardArrowDown, Home, Store, Add } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MapCard from './MapCard.jsx'
import { GlobalStoreContext } from '../store'
import CssBaseline from '@mui/material/CssBaseline';
import AuthContext from "../auth.js";


function BrowsePage() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const theme = useTheme();
  const isMediumOrSmaller = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorElSort, setAnchorElSort] = useState(null);
  const [anchorElOption, setAnchorElOption] = useState(null);


  //Search Sort options
  const [searchBy, setSearchBy] = useState('mapName'); // 'mapName' or 'username'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');


  // PAGE STUFF
  const [currentPage, setCurrentPage] = useState(1);
  // console.log(store.currentMyMapCollection)
  const [totalMaps, setTotalMaps] = useState('');
  const mapsPerPage = 8; // Display 8 MapCards per page
  const numberOfPages = Math.ceil(totalMaps / mapsPerPage);
  // Calculate the range of MapCards for the current page
  const firstMapIndex = (currentPage - 1) * mapsPerPage;
  const lastMapIndex = firstMapIndex + mapsPerPage;
  // const mapCardsToShow = Array.from({ length: mapsPerPage }, (_, index) => index + firstMapIndex).filter(index => index < totalMaps);

  // Runs only when there is an user
  useEffect(() => {
    if (auth.user != null) {
      store.getMyMapCollection(auth.user.userId);
    }
  }, [auth.user]);

  // Runs when there is a change in currentMyMapCollection
  useEffect(() => {
    if (store.currentMyMapCollection != null) {
      setTotalMaps(store.currentMyMapCollection.length)
    }
  }, [store.currentMyMapCollection]);


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

  const handleCreateMapModal = () => {
    store.setCurrentModal("CreateMapModal")
  }

  const searchAndSort = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: isMediumOrSmaller ? 'column' : 'row',
      justifyContent: 'space-between', // space out children
      alignItems: 'center',
      width: '100%', // take full width
    }}>
      {/* Search Functionality */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: isMediumOrSmaller ? 2 : 0,
      }}>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: theme.palette.background.paper
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
            id="outerMenuByName"
            value={searchBy}
            onChange={handleSearchByChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Search By' }}
            sx={{ height: '50px' }}
          >
            <MenuItem id="byMapNameBtn" value="mapName">Map Name</MenuItem>
            <MenuItem id="byUsernameBtn" value="username">Username</MenuItem>
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
            id="outerSortByMenuBtn"
            value={sortBy}
            onChange={handleSortByChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Sort By' }}
            sx={{ height: '50px' }}
          >
            <MenuItem id="recentSortSelect" value="recent">Recent</MenuItem>
            <MenuItem id="nameSortSelect" value="alphabetical-order">Alphabetical Order</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );



  return (
    <Box sx={{ p: 3, overflow: 'hidden', bgcolor: theme.palette.background.default }}>
      <CssBaseline />

      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{store.togglebrowseHome ? "My Maps" : "Marketplace"}</Typography>
      <Box sx={{ mt: '10px' }}>
        {searchAndSort()}
      </Box>

      <Button id="createMapOuterBtn" onClick={handleCreateMapModal} variant="contained" aria-label="add" sx={{ position: 'absolute', top: 85, right: 20 }}>Import Map</Button>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {store.currentMyMapCollection &&
          store.currentMyMapCollection
            .slice(firstMapIndex, lastMapIndex) // Only take the maps for the current page
            .map((map, index) => (
              <Grid item xs={12} sm={6} md={3} key={map._id}>
                <MapCard map={map} />
              </Grid>
            ))
        }
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