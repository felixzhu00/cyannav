import React, { useContext, useState } from "react";
import {
    Alert,
    Box,
    Button,
    IconButton,
    Modal,
    Typography,
    TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import AuthContext from "../../auth.js";
import { useNavigate } from "react-router-dom";

/**
 * Modal box style
 */
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function MUIDeleteAccountModal(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Handler to check all the fields are correct and deletes the account
     * @param {*} event
     */
    const handleDelete = async (event) => {
        event.preventDefault();
        const formElement = document.getElementById("deleteAccountForm");
        const data = new FormData(formElement);
        const input = {
            username: data.get("username"),
            email: data.get("email"),
            password: data.get("password"),
        };
        if (input.username != "" && input.email != "" && input.password != "") {
            try {
                await auth.deleteAccount(
                    input.username,
                    input.email,
                    input.password
                );
                props.onClose();
                await auth.logoutUser();
                navigate("/login");
            } catch (error) {
                console.log(error.message);
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage("All fields are required!");
        }
    };

    return (
        <div>
            <Modal
                open={props.open}
                aria-labelledby="delete-account-modal-title"
                aria-describedby="delete-account-modal-description"
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
                            id="delete-account-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Delete Your Account
                        </Typography>
                        <IconButton onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Typography
                        id="delete-account-modal-description"
                        variant="body1"
                    >
                        Fill in the information below to delete your account.
                        <br></br>
                        Note: Your published maps will NOT be removed, please
                        delete them manually if you wish to remove them.
                    </Typography>
                    <Box
                        component="form"
                        id="deleteAccountForm"
                        sx={{
                            "& .MuiTextField-root": { m: 1, width: "95%" },
                            mt: 2,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            margin="normal"
                            onChange={() => setErrorMessage("")}
                            required
                            fullWidth
                            name="username"
                            label="Username"
                            type="text"
                            id="username"
                        />
                        <TextField
                            margin="normal"
                            onChange={() => setErrorMessage("")}
                            required
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            id="email"
                        />
                        <TextField
                            margin="normal"
                            onChange={() => setErrorMessage("")}
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
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
                                onClick={handleDelete}
                                variant="contained"
                                sx={{
                                    backgroundColor: "red",
                                    color: "black",
                                    mr: "10px",
                                }}
                            >
                                DELETE
                            </Button>
                            <Button
                                onClick={props.onClose}
                                variant="outlined"
                                sx={{
                                    color: "black",
                                }}
                            >
                                CANCEL
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
