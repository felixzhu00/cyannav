import { useContext, useState, useEffect } from "react";
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
import RegisterLogo from "../assets/cyannav_logo_wo_name.png";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth";

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (auth.user == null) {
            setErrorMessage(auth.error);
        } else {
            if (auth.loggedIn) {
                navigate("/browsepage");
            }
        }
    }, [auth]);

    /**
     * Handler for when the user clicks on the Register button
     * @param {*} event
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const input = {
            email: data.get("email"),
            username: data.get("username"),
            password: data.get("password"),
            verifyPassword: data.get("verify-password"),
        };
        try {
            await auth.registerUser(
                input.email,
                input.username,
                input.password,
                input.verifyPassword
            );
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.message);
        }
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
                <Box component="img" sx={{ m: 2 }} src={RegisterLogo} />
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                >
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
                                onChange={() => setErrorMessage("")}
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
                                onChange={() => setErrorMessage("")}
                                name="verify-password"
                                label="Verify Password"
                                type="password"
                                id="verify-password"
                                autoComplete="new-password"
                            />
                            {errorMessage && (
                                <Typography
                                    id="errMsg2"
                                    color="error"
                                    variant="subtitle2"
                                    sx={{ mt: 1 }}
                                >
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
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link
                                onClick={() => {
                                    navigate("/login");
                                    auth.updateError("");
                                }}
                                variant="body2"
                            >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
