import React, { useState, useContext } from "react";
import {
    Alert,
    Box,
    Button,
    Modal,
    Typography,
    IconButton,
    TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
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

export default function MUIChangeUsernameModal(props) {
    // const [token, setToken] = useCookies(["user"]);
    const theme = useTheme();
    const { auth } = useContext(AuthContext);
    const [newUsername, setNewUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Handler to save the new username
     */
    const handleSave = async () => {
        if (newUsername !== "") {
            try {
                await auth.updateUsername(newUsername, newUsername);
                props.onClose();
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage("Please fill in all required fields.");
        }
    };

    /**
     * Handler when the user types in a new username
     */
    const handleUsernameChange = (event) => {
        setNewUsername(event.target.value);
    };

    return (
        <div>
            <Modal
                open={props.open}
                aria-labelledby="change-username-modal-title"
                aria-describedby="change-username-modal-description"
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
                            id="change-username-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Change Username
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
                            id="outlined-disabled"
                            label="Old Username"
                            defaultValue={auth.user.username}
                            fullWidth
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="New Username"
                            defaultValue=""
                            fullWidth
                            onChange={(event) => {
                                handleUsernameChange(event);
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
