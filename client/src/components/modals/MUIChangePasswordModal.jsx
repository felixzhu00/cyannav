import React, { useState, useContext } from "react";
import {
    Alert,
    Box,
    Button,
    Typography,
    Modal,
    IconButton,
    TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import AuthContext from "../../auth.js";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function MUIChangePasswordModal(props) {
    const theme = useTheme();
    const { auth } = useContext(AuthContext);
    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newVerifyPassword, setNewVerifyPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Handler for saving the new email
     */
    const handleSave = async () => {
        console.log(currPassword);
        if (
            currPassword !== "" &&
            newPassword !== "" &&
            newVerifyPassword !== ""
        ) {
            try {
                await auth.updatePassword(
                    currPassword,
                    newPassword,
                    newVerifyPassword
                );
                props.onClose();
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage("Fill in all required fields.");
        }
    };

    /**
     * Handler for when the user inputs a new password
     * @param {*} event new password
     */
    const handlePasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    /**
     * Handler for user inputting the verify password
     * @param {*} event verify new password
     */
    const handleVerifyPasswordChange = (event) => {
        setNewVerifyPassword(event.target.value);
    };

    /**
     * Handler for user inputting their current password
     * @param {*} event old password
     */
    const handleCurrPasswordChange = (event) => {
        setCurrPassword(event.target.value);
    };

    return (
        <div>
            <Modal
                open={props.open}
                aria-labelledby="change-password-modal-title"
                aria-describedby="change-password-modal-description"
            >
                <Box sx={style}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            id="change-email-password-title"
                            variant="h6"
                            component="h2"
                        >
                            Change Password
                        </Typography>
                        <IconButton onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box
                        component="form"
                        sx={{
                            "& .MuiTextField-root": { m: 1, width: "95%" },
                            mt: 2,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="current-password"
                            label="Current Password"
                            type="password"
                            id="current-password"
                            autoComplete="current-password"
                            onChange={(event) => {
                                handleCurrPasswordChange(event);
                                setErrorMessage("");
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="new-password"
                            label="New Password"
                            type="password"
                            id="new-password"
                            onChange={(event) => {
                                handlePasswordChange(event);
                                setErrorMessage("");
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="verify-new-password"
                            label="Verify New Password"
                            type="password"
                            id="verify-new-password"
                            onChange={(event) => {
                                handleVerifyPasswordChange(event);
                                setErrorMessage("");
                            }}
                        />
                        {errorMessage && (
                            <Alert severity="error" sx={{ mt: "10px" }}>
                                {errorMessage}
                            </Alert>
                        )}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 2,
                                mr: 2,
                            }}
                        >
                            <Button
                                onClick={handleSave}
                                variant="contained"
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: "black",
                                    mr: "10px",
                                    width: "90px",
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={props.onClose}
                                variant="outlined"
                                sx={{ color: "black" }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
