import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Logo from '../assets/cyannav_logo_wo_name.png'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export default function ForgetPswdScreen() {
    const [step, setStep] = useState('emailStep');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Used for displaying error messages
    const [emailError, setEmailError] = useState('');
    const [verificationCodeError, setVerificationCodeError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = (event) => {
        event.preventDefault();

        // TODO: Need backend to check if email exists (Example code below)
        // if (!isEmailRegistered(email)) {
        //     setEmailError("This email address was never registered.");
        // } else {
        //     setEmailError('Email error message test'); // Clear any existing error message
        //     setStep('verificationStep');
        // }


        // setEmailError("Email error message test");
        setStep('verificationStep');

    };

    const handleVerificationCodeSubmit = (event) => {
        event.preventDefault();

        // TODO: Need backend to do this. (Example code below)
        // if (!isValidVerificationCode(verificationCode)) {
        //     setVerificationCodeError("Wrong verification code.");
        // } else {
        //     setVerificationCodeError('Verification error message test'); // Clear any existing error message
        //     setStep('resetPasswordStep');
        // }
        // setVerificationCodeError('Verification error message test'); // Clear any existing error message
        setStep('resetPasswordStep');


    };

    const handleResetPasswordSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        } else {
            setPasswordError('Password error message test');
        }
        // TODO: Reset password logic here
        navigate('/login/');
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
                <Box component='img' sx={{ m: 2 }} src={Logo} />
                <Typography component="h1" variant="h5">
                    {step === 'emailStep' ? 'Forgot Password' : 'Enter Verification Code'}
                </Typography>
                <Box component="form" noValidate onSubmit={step === 'emailStep' ? handleEmailSubmit : handleVerificationCodeSubmit} sx={{ mt: 3, width: '350px' }}>
                    {step === 'emailStep' && (
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
                                    setEmailError('');
                                }} />
                            {emailError && <Typography color="error" variant="subtitle2" sx={{ mt: 1 }}>{emailError}</Typography>}

                            {/* <Typography
                                color="error"
                                variant="subtitle2"
                                sx={{ mt: 1, height: emailError ? 'auto' : '24px' }}> 
                                // {emailError}
                            </Typography> */}
                        </>
                    )}
                    {step === 'verificationStep' && (
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
                                    setVerificationCodeError('');
                                }}
                            />
                            {verificationCodeError && <Typography color="error" variant="subtitle2" sx={{ mt: 1 }}>{verificationCodeError}</Typography>}
                        </>
                    )}
                    {step === 'resetPasswordStep' && (
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
                                    setPassword(e.target.value)
                                    setPasswordError('');
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
                                    setConfirmPassword(e.target.value)
                                    setPasswordError('');
                                }}
                                sx={{ mt: 2 }}
                            />
                            {passwordError && <Typography color="error" variant="subtitle2" sx={{ mt: 1 }}>{passwordError}</Typography>}
                        </>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={step === 'resetPasswordStep' ? handleResetPasswordSubmit : null}
                    >
                        {step === 'emailStep' ? 'Continue' : step === 'verificationStep' ? 'Verify Code' : 'Reset Password'}
                    </Button>
                    {step === 'verificationStep' && (
                        <Button
                            fullWidth
                            variant="text"
                            sx={{ mb: 2 }}
                            onClick={() => setStep('emailStep')}
                        >
                            Back to Email
                        </Button>
                    )}
                </Box>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Link onClick={() => { navigate('/login') }} variant="body2">
                            Remember your password? Sign in
                        </Link>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Link onClick={() => { navigate('/register') }} variant="body2">
                            Don't have an account? Sign up
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}