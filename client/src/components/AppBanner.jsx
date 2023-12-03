import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from "@mui/material";
import { Menu as MenuIcon, Home, Store } from "@mui/icons-material"; // Corrected the import for MenuIcon
import { useTheme } from "@mui/material/styles";
import logo from "../assets/cyannav_logo.svg";
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'


function AppBanner() {
  const location = useLocation();
  const { pathname } = location;



  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  // Route to different pages
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Handle menu opening and closing
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleOpenUserMenu = (event) => {
    console.log(auth.user)

    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Handle navigating to different on clicking on buttons
  const handleIconClick = () => {
    navigate("/browsepage");
  };
  const handleAccountSettingClick = () => {
    navigate("/profile");
    setAnchorElUser(null);
  };
  const handleLogoutClick = async () => {
    await auth.logoutUser()
    navigate("/login");
    setAnchorElUser(null);
  };

  // Change the current display subpage
  const handleHome = () => {
    store.toggleBrowsePage("home") //togglebrowseHome : true
    navigate("/browsepage");
    // Calls global store function
  }
  const handleStore = () => {
    store.toggleBrowsePage("store") //togglebrowseHome : false
    navigate("/browsepage");
    // Calls global store function
  }

  useEffect(() => {
  }, []);

  if (pathname === '/' || pathname === '/login/' || pathname === '/login' || pathname === '/register/' || pathname === '/register' || pathname === '/forget/' || pathname === '/forget') {
    return null;
  }

  return (
    <AppBar position="relative" sx={{ backgroundColor: theme.palette.background.default, width: "100%", zIndex: 2 }}>
      <Container maxWidth="false">
        <Toolbar disableGutters>
          {/* Hamburger Menu for smaller screens */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              <MenuItem
                onClick={handleHome}>
                <IconButton id="myMapsBtn" sx={{ color: "black", mr: 1 }}>
                  <Home />
                </IconButton>
                <Typography textAlign="center">My Maps</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleStore}
              >
                <IconButton id="marketplaceBtn" sx={{ color: "black", mr: 1 }}>
                  <Store />
                </IconButton>
                <Typography textAlign="center">Marketplace</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo */}
          <Button
            id="logoBtn"
            onClick={() => {
              handleIconClick()
              /* navigate('/browsepage') */
            }}
            sx={{ mr: "16px" }}
          >
            <Box
              component="img"
              sx={{ width: "175px", borderRadius: 1, ml: "-16px", mr: "-16px" }}
              src={logo}
            />
          </Button>

          {/* Home and Store Buttons for larger screens */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              mr: 2,
            }}
          >
            <IconButton
              sx={{ color: "black" }}
              onClick={handleHome
                // () => {navigate('/home')}
              }
            >
              <Home sx={{ fontSize: "30px" }} />
            </IconButton>
            <IconButton
              id="marketplaceBtn"
              sx={{ color: "black" }}
              onClick={handleStore
                // () => {navigate('/store')}
              }
            >
              <Store sx={{ fontSize: "30px" }} />
            </IconButton>
          </Box>

          {/* Title and Author of map */}
          {store.mapNameActive &&
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                maxWidth: { xs: 100, sm: 500 }, // Adjust max width based on screen size
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: { xs: "none", sm: "block" }, // Hide on very small screens
              }}
            >
              (Title) by (Name)
            </Typography>}

          {/* Spacer to push the user avatar to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* User Avatar and Menu */}
          {auth.loggedIn && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Open settings">
                <IconButton id="settingsDropdown" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src={logo} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box
                  sx={{
                    maxWidth: 200,
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: "15px",
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>Username:</Typography>
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {auth.user != null ? auth.user.username : ""}
                  </Typography>
                </Box>
                <MenuItem id="settingsDropdownOption" key={"Account Settings"} onClick={handleAccountSettingClick}>
                  <Typography textAlign="center">Account Settings</Typography>
                </MenuItem>
                <MenuItem id="logoutBtn" key={"Logout"} onClick={handleLogoutClick}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* When the user continues as guest */}
          {!auth.loggedIn && (
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </Box>
          )}

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppBanner;
