import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import RegisterLogo from '../assets/cyannav_logo_wo_name.png'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth'

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const input = {
            email: data.get('email'),
            username: data.get('username'),
            password: data.get('password'),
        }
        if (data.get('password') !== data.get('verify-password')) { // checks if two fields match
            setErrorMessage('The passwords do not match.');
            return;
        }

        auth.registerUser(input.email, input.username, input.password, input.password)
        if (auth.error != null) {
            console.log(auth.error)
        } else {
            setErrorMessage('');
            navigate('/login');
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
                <Box component='img' sx={{ m: 2 }} src={RegisterLogo} />
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="username"
                                label="Username (visible to public)"
                                name="username"
                                autoComplete="username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                onChange={() => setErrorMessage('')}
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                onChange={() => setErrorMessage('')}
                                name="verify-password"
                                label="Verify Password"
                                type="password"
                                id="verify-password"
                                autoComplete="new-password"
                            />
                            {errorMessage && (
                                <Typography color="error" variant='subtitle2' sx={{ mt: 1 }}>
                                    {errorMessage}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Button
                        id="registerBtn"
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link onClick={() => { navigate('/login') }} variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>

                </Box>
            </Box>
        </Container>
    );
}