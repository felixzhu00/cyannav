import React, { useState, useRef, useEffect } from 'react';
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

export default function ProfileScreen() {
    const [currentModel, setCurrentModel] = useState('');
    // Example user data, replace with actual data as needed
    const userData = {
        username: 'User123',
        email: 'user123@example.com',
        password: 'password123' // In a real scenario, you wouldn't display a password like this
    };
    const handleDeleteAccount = () => {
        // Implement account deletion logic
        console.log('Delete account');
    };

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
                <Box component='img' sx={{ m: 2 }} src={LoginLogo}></Box>
                <Typography component="h1" variant="h5">
                    Your Profile
                </Typography>

                <Box sx={{ mt: 1 }}>
                    <TextField
                        id="username"
                        label="Username"
                        defaultValue={userData.username}
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
                                        <Edit id="usernameEditBtn" onClick={()=> {setCurrentModel("username")}}/>
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
                        defaultValue={userData.email}
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
                                        <Edit id="emailEditBtn" onClick={()=> {setCurrentModel("email")}} />
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
                        defaultValue={userData.password}
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
                                        <Edit id="passwordEditBtn" onClick={()=> {setCurrentModel("password")}}/>
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
                    onClick={() => {setCurrentModel("delete")}}
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
            </Box>
        </Container >
    );
}
