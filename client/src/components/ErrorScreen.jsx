import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HttpsIcon from "@mui/icons-material/Https";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useNavigate } from "react-router-dom";

const ErrorScreen = ({ errorType }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const goHome = () => navigate("/"); // Replace '/' with your home page route

    const errorContent = {
        notFound: {
            icon: (
                <ReportProblemIcon
                    sx={{ fontSize: 100, color: "primary.main" }}
                />
            ),
            title: "Page Not Found",
            message:
                "The page you're looking for doesn't exist or another error occurred. Go back, or head over to the home page to choose a new page.",
        },
        unauthorized: {
            icon: <HttpsIcon sx={{ fontSize: 100, color: "primary.main" }} />,
            title: "Unauthorized Access",
            message: "You do not have permission to view this page. ",
        },
    };

    const currentError = errorContent[errorType] || errorContent.notFound;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: `calc(100vh - 113px)`,
                textAlign: "center",
                p: 3,
                gap: 2,
                backgroundColor: theme.palette.background.default,
            }}
        >
            {currentError.icon}
            <Typography variant="h4" component="h1" gutterBottom>
                {currentError.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                {currentError.message}
            </Typography>
            <Button variant="contained" color="primary" onClick={goHome}>
                Go Home
            </Button>
        </Box>
    );
};

export default ErrorScreen;
