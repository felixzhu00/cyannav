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
import { DropzoneArea } from 'react-mui-dropzone'



export default function ProfileScreen() {
    const { auth } = useContext(AuthContext);
    const [currentModel, setCurrentModel] = useState('');
    const [profilePicUrl, setProfilePicUrl] = useState(null);

    useEffect(() => {
        // Convert buffer from auth.user.picture to a Blob
        if (auth.user && auth.user.picture) {
            const arrayBuffer = new Uint8Array(auth.user.picture.data).buffer;
            let blobType = 'image/jpeg'; // Default to JPEG

            // Check if the buffer is a PNG by checking the first byte
            if (auth.user.picture.data[0] === 137) {
                blobType = 'image/png';
            }

            const blob = new Blob([arrayBuffer], { type: blobType });
            const imageUrl = URL.createObjectURL(blob);
            setProfilePicUrl(imageUrl);

            // Clean up the object URL on unmount
            return () => {
                URL.revokeObjectURL(imageUrl);
            };
        } else {
            setProfilePicUrl(LoginLogo)
        }
    }, [auth.user]);

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
                    id="changeProfilePictureBtn"
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
                    onClick={() => { setCurrentModel("picture") }}
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
                                    <IconButton onClick={() => { setCurrentModel("username") }} >
                                        <Edit id="usernameEditBtn" />
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
                                    <IconButton onClick={() => { setCurrentModel("email") }}>
                                        <Edit id="emailEditBtn" />
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
                        value={'************'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => { setCurrentModel("password") }}>
                                        <Edit id="passwordEditBtn" />
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
                {currentModel === 'picture' && <MUIChangeProfilePicModal
                    open={currentModel === 'picture'}
                    onClose={() => setCurrentModel("")}
                    onSave={(newUrl) => setProfilePicUrl(newUrl)}
                />}
            </Box>
        </Container >
    );
}
