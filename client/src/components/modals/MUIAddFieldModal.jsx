import React, { useContext, useState } from "react";
import {
    Alert,
    Box,
    Button,
    IconButton,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { GlobalStoreContext } from "../../store";

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

export default function MUIAddFieldModal(props) {
    const { store } = useContext(GlobalStoreContext);
    const theme = useTheme();
    const [fieldName, setFieldName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Handler for adding a field to a map
     */
    const handleAdd = async () => {
        if (fieldName != "") {
            await store.setField(fieldName);
            props.onNew(fieldName);
            props.onClose();
        } else {
            setErrorMessage("Please fill in the required fields.");
        }
    };

    return (
        <div>
            <Modal
                open={props.open}
                aria-labelledby="add-field-modal-title"
                aria-describedby="add-field-modal-description"
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
                            id="add-field-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Add Field
                        </Typography>

                        <IconButton onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Typography id="add-field-modal-description" variant="body">
                        What is the name of the field you would like to add?
                    </Typography>
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
                            required
                            id="outlined-required"
                            label="Field"
                            fullWidth
                            value={fieldName}
                            onChange={(e) => setFieldName(e.target.value)}
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
                                onClick={handleAdd}
                                variant="contained"
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: "black",
                                    mr: "5px",
                                    width: "100px",
                                }}
                            >
                                Add
                            </Button>
                            <Button
                                onClick={props.onClose}
                                variant="outlined"
                                sx={{
                                    color: "black",
                                    ml: "5px",
                                    width: "100px",
                                }}
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
