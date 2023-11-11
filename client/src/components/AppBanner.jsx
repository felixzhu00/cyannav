import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../assets/cyannav_logo.png'
import { ThumbUp, ThumbUpAltOff, ThumbDownAltOff, ThumbDown } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';


const settings = ['Account Settings', 'Logout'];
const mapTitle = ['MAP TITLE']
const mapAuthor = ['MAP AUTHOR']
const upvoteCount = 100
const downvoteCount = 50

function AppBanner() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation(); // Get access to the location object
  const { pathname } = location; // Destructure pathname from location object

  // Check if the current pathname is '/login' or '/register'
  // and return null (don't render anything) if it's a match
  if (pathname === '/login/' || pathname === '/login' || pathname === '/register/' || pathname === '/register' || pathname === '/forget/' || pathname === '/forget') {
    return null;
  }

  // const handleOpenNavMenu = (event) => {
  //   setAnchorElNav(event.currentTarget);
  // };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null);
  // };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'grey' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box component="img"
            sx={{
              width: '200px',
              borderRadius: 2,
              flexGrow: 0
            }}
            src={logo}
          />
          <Typography
            variant="h5"
            noWrap
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex', paddingLeft: '25px' },
              fontFamily: 'inter',
              fontWeight: 'bold',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            {mapTitle} by {mapAuthor}
          </Typography>


          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none', paddingLeft: '12px' },
              flexGrow: 1,
              fontFamily: 'inter',
              fontWeight: 700,
              color: 'black',
              textDecoration: 'none',
            }}
          >
            {mapTitle}
          </Typography>

          {/* Spacer Box to push everything else to the right */}
          <Box sx={{ flexGrow: 1 }}>
          </Box>

          {/* ThumbDown and ThumbUp icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
            <IconButton aria-label="upvote">
              <ThumbUp sx={{ color: 'black' }} />
            </IconButton>
            <Typography variant="body1" sx={{ color: 'black' }}>{upvoteCount}</Typography>

            <IconButton aria-label="downvote">
              <ThumbDown sx={{ color: 'black' }} />
            </IconButton>
            <Typography variant="body1" sx={{ color: 'black' }}>{downvoteCount}</Typography>

          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu> */}

            <Button
              variant='outlined'
              sx={{
                margin: '2px',
                border: '3px solid',
                borderColor: 'black',
                color: 'black',
                backgroundColor: 'lightgrey',
                '&:hover': {
                  backgroundColor: 'grey', // This will be the background color on hover
                  borderColor: 'black', // If you also want to change the border color on hover
                  border: '3px solid',

                },
              }}>
              <Typography fontWeight={'bold'}>Login</Typography>
            </Button>

            <Button
              variant='outlined'
              sx={{
                margin: '2px',
                border: '3px solid',
                borderColor: 'black',
                color: 'black',
                backgroundColor: 'lightgrey',
                '&:hover': {
                  backgroundColor: 'grey',
                  borderColor: 'black',
                  border: '3px solid',

                },
              }}>
              <Typography fontWeight={'bold'}>Register</Typography>

            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppBanner;