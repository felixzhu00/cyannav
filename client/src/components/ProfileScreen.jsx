import React, { useState, useRef, useEffect, useContext } from 'react';
import { Typography, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import { AccountCircle, Email, Lock, Edit, DeleteForever } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LoginLogo from '../assets/cyannav_logo_wo_name.png'
import MUIChangeEmailModal from './modals/MUIChangeEmailModal';
import MUIChangePasswordModal from './modals/MUIChangePasswordModal';
import MUIChangeUsernameModal from './modals/MUIChangeUsernameModal';
import MUIDeleteAccountModal from './modals/MUIDeleteAccountModal';
import MUIChangeProfilePicModal from './modals/MUIChangeProfilePicModal';
import AuthContext from '../auth'



export default function ProfileScreen() {
    const { auth } = useContext(AuthContext);
    const [currentModel, setCurrentModel] = useState('');
    // Example user data, replace with actual data as needed
    
    const handleDeleteAccount = () => {
        // Implement account deletion logic
        console.log('Delete account');
    };
    
      useEffect(() => {
      });

    const [showProfilePicModal, setShowProfilePicModal] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState(LoginLogo);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        m: 5,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        '&:hover > .overlay': {
                            display: 'flex',
                        }
                    }}
                    onClick={() => setShowProfilePicModal(true)}
                >
                    <Box
                        component="img"
                        sx={{
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid',
                            borderColor: 'primary.main'
                        }}
                        src={profilePicUrl}
                    />
                    <Box
                        className="overlay"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}
                    >
                        {/* Overlay content, such as an icon or text */}
                        <Typography variant="h6">Change Picture</Typography>
                    </Box>
                </Box>
                <Typography component="h1" variant="h5">
                    Your Profile
                </Typography>

                <Box sx={{ mt: 1 }}>
                    <TextField
                        id="username"
                        label="Username"
                        value={auth.user.username ? auth.user.username : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <Edit id="usernameEditBtn" onClick={() => { setCurrentModel("username") }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="email"
                        label="Email Address"
                        value={auth.user.email ? auth.user.email : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <Edit id="emailEditBtn" onClick={() => { setCurrentModel("email") }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="password"
                        label="Password"
                        value={ '************'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <Edit id="passwordEditBtn" onClick={() => { setCurrentModel("password") }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        fullWidth
                        margin="normal"
                        type="password"
                    />

                </Box>
                <Button
                    id="deleteAccountBtn"
                    sx={{
                        color: "red",
                        mt: "15px"
                    }}
                    startIcon={<DeleteForever />}
                    onClick={() => { setCurrentModel("delete") }}
                >
                    Delete your account
                </Button>

                {currentModel === 'email' && <MUIChangeEmailModal
                    open={currentModel === 'email'}
                    onClose={() => setCurrentModel("")} />}
                {currentModel === 'password' && <MUIChangePasswordModal
                    open={currentModel === 'password'}
                    onClose={() => setCurrentModel("")} />}
                {currentModel === 'username' && <MUIChangeUsernameModal
                    open={currentModel === 'username'}
                    onClose={() => setCurrentModel("")} />}
                {currentModel === 'delete' && <MUIDeleteAccountModal
                    open={currentModel === 'delete'}
                    onClose={() => setCurrentModel("")} />}
                {showProfilePicModal && <MUIChangeProfilePicModal
                    open={showProfilePicModal}
                    onClose={() => setShowProfilePicModal(false)}
                    onSave={(newUrl) => setProfilePicUrl(newUrl)}
                />}
            </Box>
        </Container >
    );
}
