import React, { useState, useEffect, useContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import LoginLogo from "../assets/cyannav_logo_wo_name.png";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth";

export default function LoginScreen(props) {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {



        if (auth.user == null) {
            setErrorMessage(auth.error);
        } else {
            if(auth.loggedIn){
                navigate('/browsepage');
            }
        }
    }, [auth]);

    /**
     * Handler for the user clicks on the login button
     * @param {*} event
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let input = {
            email: data.get("email"),
            password: data.get("password"),
        };
        try {
            await auth.loginUser(input.email, input.password);
            setErrorMessage("");
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
        }
    };

    /**
     * Handler for when the user wants to continue to use our site as guest
     */
    const handleContAsGuest = () => {
        props.handleGuest(true);
        navigate("/browsepage");
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box component="img" sx={{ m: 2 }} src={LoginLogo}></Box>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
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
                        <Typography
                            id="errMsg1"
                            color="red"
                            variant="subtitle2"
                            sx={{ mt: 1 }}
                        >
                            {errorMessage}
                        </Typography>
                    )}

                    <Button
                        onClick={() => {
                            props.handleGuest(false);
                        }}
                        id="signInBtn"
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        Sign In
                    </Button>
                    <Button
                        onClick={() => {
                            handleContAsGuest();
                        }}
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 2 }}
                    >
                        Continue as Guest!
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link
                                onClick={() => {
                                    navigate("/forget");
                                }}
                                variant="body2"
                            >
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                id="registerLink"
                                onClick={() => {
                                    navigate("/register");
                                    auth.updateError("");
                                }}
                                variant="body2"
                            >
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
