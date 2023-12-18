import { useState, useContext, useEffect } from "react";
import { Typography, Grid, Box, InputBase, MenuItem, Paper, Button, IconButton, FormControl, Select } from '@mui/material';
import { Search } from '@mui/icons-material';
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

  //Search Sort options
  const [searchBy, setSearchBy] = useState('mapName'); // 'mapName' or 'username'
  const [searchTerm, setSearchTerm] = useState('');


  // PAGE STUFF
  const [currentPage, setCurrentPage] = useState(1);
  // console.log(store.mapCollection)
  const [totalMaps, setTotalMaps] = useState('');
  const mapsPerPage = 8; // Display 8 MapCards per page
  const numberOfPages = Math.ceil(totalMaps / mapsPerPage);
  // Calculate the range of MapCards for the current page
  const firstMapIndex = (currentPage - 1) * mapsPerPage;
  const lastMapIndex = firstMapIndex + mapsPerPage;


  // // Rerender the whole componenet when MapCollection is updated
  // useEffect(() => {
  // }, [store.mapCollection]);
  // This useEffect runs when mapCollection changes

  // Runs only when there is an user
  useEffect(() => {
    if (auth.user != null) {
      store.getMyMapCollection(auth.user.userId);
    } else {
      store.getMarketplaceCollection();
    }
  }, [auth.user]);

  useEffect(() => {
    if (store.mapCollection != null) {
      setSearchTerm('');
      setCurrentPage(1);
    }
  }, [store.togglebrowseHome]);

  useEffect(() => {
    if (auth.user != null) {
      if (store.togglebrowseHome) {
        store.getMyMapCollection(auth.user.userId);
      } else {
        store.getMarketplaceCollection();
      }
    }
  }, [store.togglebrowseHome]);

  // Runs when there is a change in mapCollection
  useEffect(() => {
    if (store.mapCollection != null) {
      setTotalMaps(store.mapCollection.length)
    }
  }, [store.mapCollection]);


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
    store.setSortBy(event.target.value)
    // implemet the asc and dec order later
  }

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateMapModal = async () => {
    await store.setCurrentModal("CreateMapModal")
  }


  //Search condition of pressing enter in search bar or search icon
  const handleSearch = async () => {
    await store.searchForMapBy(searchBy, searchTerm)
    console.log(searchBy, searchTerm)
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await store.searchForMapBy(searchBy, searchTerm)
    }
  };

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
            onKeyPress={handleKeyPress}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
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
            value={store.sortBy}
            onChange={handleSortByChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Sort By' }}
            sx={{ height: '50px' }}
          >
            <MenuItem id="recentSortSelect" value="recent">Recently Created</MenuItem>
            <MenuItem id="nameSortSelect" value="alphabetical-order">Alphabetical Order</MenuItem>
            <MenuItem id="mostLikedSortSelect" value="most-liked">Most Liked</MenuItem>
            <MenuItem id="mostDislikedSortSelect" value="most-disliked">Most Disliked</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3, overflow: 'hidden', bgcolor: theme.palette.background.default }}>
      <CssBaseline />

      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{(store.togglebrowseHome && auth.loggedIn) ? "My Maps" : "Marketplace"}</Typography>
      <Box sx={{ mt: '10px' }}>
        {searchAndSort()}
      </Box>

      {auth.loggedIn && (<Button
        id="createMapOuterBtn"
        onClick={handleCreateMapModal}
        variant="contained"
        aria-label="add"
        sx={{ position: 'absolute', top: 85, right: 20 }}>
        Import Map
      </Button>)}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {store.mapCollection &&
          store.mapCollection
            .slice(firstMapIndex, lastMapIndex) // Only take the maps for the current page
            .map((map, index) => (
              <Grid item xs={12} sm={6} md={3} key={map._id}>
                <MapCard map={map} />
              </Grid>
            ))
        }
      </Grid>

      {totalMaps == 0 && (
        <Box sx={{ pt: 10, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* Main Welcome Message */}
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center', mb: 2 }}>
            👋🏼 Welcome to CyanNav!
          </Typography>
          {/* Secondary Message */}
          <Typography variant="h6" sx={{ textAlign: 'center', color: 'secondary.main' }}>
            Click on the Import Map button to start!
          </Typography>
        </Box>
      )}

      {totalMaps > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={numberOfPages}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export default BrowsePage;