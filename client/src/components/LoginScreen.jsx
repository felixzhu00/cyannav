import React, { useState, useRef, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoginLogo from '../assets/cyannav_logo_wo_name.png'
import { useNavigate } from 'react-router-dom';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'


export default function LoginScreen(props) {
    const [signinButton, setsigninButton] = useState(null);
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [errorMessage, setErrorMessage] = useState('The username and password combination is incorrect.');
    const handleSubmit = (event) => {

        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let input = {
            email: data.get('email'),
            password: data.get('password'),
        }
        auth.loginUser(input.email, input.password)
        if (auth.error != null) {
            console.log(auth.error)
        } else {
            console.log(auth.user, auth.loggedIn)
            navigate('/browsepage');
        }
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
                <Box component='img' sx={{ m: 2 }} src={LoginLogo}>
                </Box>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        required
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                    />
                    {errorMessage && (
                        <Typography color='red' variant="subtitle2" sx={{ mt: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}

                    <Button
                        onClick={() => { props.handleGuest(false) }}
                        id="signInBtn"
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        Sign In
                    </Button>
                    <Button
                        onClick={() => { props.handleGuest(true) }}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 2 }}
                    >
                        Continue as Guest!
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link onClick={() => { navigate('/forget') }} variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link id="registerLink" onClick={() => { navigate('/register') }} variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}