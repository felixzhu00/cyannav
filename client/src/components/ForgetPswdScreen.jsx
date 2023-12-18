import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import Logo from "../assets/cyannav_logo_wo_name.png";
import { useNavigate } from "react-router-dom";

export default function ForgetPswdScreen() {
    const navigate = useNavigate();

    const [step, setStep] = useState("emailStep");
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [verificationCodeError, setVerificationCodeError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    /**
     * Handler for when the user inputs their email and clicks Submit
     * @param {*} event
     */
    const handleEmailSubmit = (event) => {
        event.preventDefault();
        // const data = new FormData(event.currentTarget);
        console.log("Email submitted: ", email);
        setStep("verificationStep"); // Move to the next step
    };

    /**
     * Handler for when the user inputs their verification code and clicks Submit
     * @param {*} event
     */
    const handleVerificationCodeSubmit = (event) => {
        event.preventDefault();
        // const data = new FormData(event.currentTarget);
        console.log("Verification code submitted: ", verificationCode);
        setStep("resetPasswordStep");
    };

    /**
     * Handler for when the user enters their new password and clicks Submit
     * @param {*} event
     */
    const handleResetPasswordSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        } else {
            setPasswordError("Password error message test");
        }
        // TODO: Reset password logic here
        navigate("/login/");
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
                <Box component="img" sx={{ m: 2 }} src={Logo} />
                <Typography component="h1" variant="h5">
                    {step === "emailStep"
                        ? "Forgot Password"
                        : "Enter Verification Code"}
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={
                        step === "emailStep"
                            ? handleEmailSubmit
                            : handleVerificationCodeSubmit
                    }
                    sx={{ mt: 3, width: "350px" }}
                >
                    {step === "emailStep" && (
                        <>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError("");
                                }}
                            />
                            {emailError && (
                                <Typography
                                    color="error"
                                    variant="subtitle2"
                                    sx={{ mt: 1 }}
                                >
                                    {emailError}
                                </Typography>
                            )}
                        </>
                    )}
                    {step === "verificationStep" && (
                        <>
                            <TextField
                                required
                                fullWidth
                                id="verificationCode"
                                label="Verification Code"
                                name="verificationCode"
                                autoComplete="one-time-code"
                                value={verificationCode}
                                onChange={(e) => {
                                    setVerificationCode(e.target.value);
                                    setVerificationCodeError("");
                                }}
                            />
                            {verificationCodeError && (
                                <Typography
                                    color="error"
                                    variant="subtitle2"
                                    sx={{ mt: 1 }}
                                >
                                    {verificationCodeError}
                                </Typography>
                            )}
                        </>
                    )}
                    {step === "resetPasswordStep" && (
                        <>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="New Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError("");
                                }}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm New Password"
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setPasswordError("");
                                }}
                                sx={{ mt: 2 }}
                            />
                            {passwordError && (
                                <Typography
                                    color="error"
                                    variant="subtitle2"
                                    sx={{ mt: 1 }}
                                >
                                    {passwordError}
                                </Typography>
                            )}
                        </>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={
                            step === "resetPasswordStep"
                                ? handleResetPasswordSubmit
                                : null
                        }
                    >
                        {step === "emailStep"
                            ? "Continue"
                            : step === "verificationStep"
                            ? "Verify Code"
                            : "Reset Password"}
                    </Button>
                    {step === "verificationStep" && (
                        <Button
                            fullWidth
                            variant="text"
                            sx={{ mb: 2 }}
                            onClick={() => setStep("emailStep")}
                        >
                            Back to Email
                        </Button>
                    )}
                </Box>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Link
                            onClick={() => {
                                navigate("/login");
                            }}
                            variant="body2"
                        >
                            Remember your password? Sign in
                        </Link>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Link
                            onClick={() => {
                                navigate("/register");
                            }}
                            variant="body2"
                        >
                            Don't have an account? Sign up
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
