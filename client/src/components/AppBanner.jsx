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
import { ThumbUp, ThumbUpAltOff, ThumbDownAltOff, ThumbDown, PartyMode } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';


function AppBanner(props) {
  
  const navigate = useNavigate();

  const settings = ['Account Settings', 'Logout'];
  const mapTitle = ['MAP TITLE']
  const mapAuthor = ['MAP AUTHOR']
  const upvoteCount = 100
  const downvoteCount = 50
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

  const handleCloseUserMenu = (setting) => {
    if (setting == 'Account Settings') {
      navigate('/profile')
    }

    if (setting == 'Logout') {
      navigate('/login')
    }
    setAnchorElUser(null);
  };


  const guestAccount = () => {
    return (
      <>
        <Button
          onClick={() => { navigate('/login') }}
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
          onClick={() => { navigate('/register') }}
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
      </>


    );
  }

  const userAccount = () => {
    return (
      <>
        <Typography variant='h5' sx={{ paddingRight: '10px', color: 'black', fontWeight: 'bold', display: { xs: 'none', md: 'block' } }}>Username</Typography>

        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu} sx={{}}>
            <Avatar alt="profile_picture" src="/static/images/avatar/2.jpg" />
          </IconButton>
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
              <MenuItem key={setting} onClick={() => { handleCloseUserMenu(setting) }}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </>
    );
  }



  return (
    // <AppBar position="static" sx={{ backgroundColor: 'cyan' }}>
    //   <Container maxWidth="xl">
    //     <Toolbar disableGutters>
    //       <Button onClick={()=>{navigate('/browsepage')}}>
    <AppBar position="static" sx={{ backgroundColor: 'cyan', width: "100%" }}>
      <Container maxWidth="false">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button onClick={() => { navigate('/browsepage') }}>
              <Box component="img"
                sx={{
                  width: '200px',
                  borderRadius: 2,
                  flexGrow: 0
                }}
                src={logo}
              />
            </Button>
            <Typography
              variant="h5"
              noWrap
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex', paddingLeft: '25px' },
                fontWeight: 'bold',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              {pathname === '/mapview' ? (mapTitle + (props.guest ? " by " + mapAuthor : "")) : ""}
            </Typography>
          </Box>

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

          {/* Spacer Box to push everything else to the right
          <Box sx={{ flexGrow: 1 }}>
          </Box> */}

          {/* ThumbDown and ThumbUp icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
              <IconButton aria-label="upvote">
                <ThumbUp sx={{ color: 'black' }} />
              </IconButton>
              <Typography variant="body1" sx={{ display: { xs: 'none', md: 'block' }, color: 'black' }}>{upvoteCount}</Typography>

              <IconButton aria-label="downvote">
                <ThumbDown sx={{ color: 'black' }} />
              </IconButton>
              <Typography variant="body1" sx={{ display: { xs: 'none', md: 'block' }, color: 'black' }}>{downvoteCount}</Typography>

            </Box>

            {!props.guest ? userAccount() : guestAccount()}
            {/* <------ Logging in and Registering ------> */}



          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppBanner;