import * as React from "react";
import { Close } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Typography,
    Modal,
    IconButton,
    TextField,
} from "@mui/material";
import { useState, useContext } from "react";
import { useTheme } from "@emotion/react";
import AuthContext from "../../auth.js";

/**
 * Modal box style
 */
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

export default function MUIChangeEmailModal(props) {
    const theme = useTheme();
    const { auth } = useContext(AuthContext);
    const [newEmail, setNewEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Handler for saving the new email
     */
    const handleSave = async () => {
        if (newEmail !== "") {
            try {
                await auth.updateEmail(newEmail);
                props.onClose();
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage("Please fill in all required fields.");
        }
    };

    /**
     * Handler for when the user types in a new email
     * @param {*} event the new email the user has inputted
     */
    const handleEmailChange = (event) => {
        setNewEmail(event.target.value);
    };

    return (
        <div>
            <Modal
                open={props.open}
                aria-labelledby="change-email-modal-title"
                aria-describedby="change-email-modal-description"
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
                            id="change-email-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Change Email
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
                            disabled
                            type="email"
                            id="old-email"
                            label="Old Email"
                            defaultValue={auth.user.email}
                            fullWidth
                        />
                        <TextField
                            required
                            type="email"
                            id="new-email"
                            label="New Email"
                            defaultValue=""
                            fullWidth
                            onChange={(event) => {
                                handleEmailChange(event);
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
