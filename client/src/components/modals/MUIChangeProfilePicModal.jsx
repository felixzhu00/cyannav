import React, { useState, useContext } from "react";
import {
    Alert,
    Modal,
    Box,
    Button,
    IconButton,
    Typography,
    Paper,
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useTheme } from "@emotion/react";
import AuthContext from "../../auth";

/**
 * Modal box style
 */
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

/**
 * Dropzone default style
 */
const dropzoneStyle = {
    mt: 2,
    border: "1px dashed grey",
    padding: "20px",
    textAlign: "center",
    transition: "border .3s ease-in-out",
};

/**
 * Style for when the user drags a file on top of the dropzone
 */
const activeDropzoneStyle = {
    borderColor: "green",
    backgroundColor: "#f4f4f4",
};

function MUIChangeProfilePicModal(props) {
    const theme = useTheme();
    const { auth } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [dropzoneErrorMessage, setDropzoneErrorMessage] = useState("");
    const [noFileErrorMessage, setNoFileErrorMessage] = useState("");

    /**
     * Check if the file being dropped is a valid file
     * @param {*} acceptedFiles files with correct extension
     * @param {*} fileRejections bad files
     */
    const onDrop = (acceptedFiles, fileRejections) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setDropzoneErrorMessage("");
            setNoFileErrorMessage("");
        }
        if (fileRejections.length > 0) {
            setFile(null);
            setDropzoneErrorMessage(
                "Invalid file type. Please upload a compatible file."
            );
            setNoFileErrorMessage("");
        }
    };

    /**
     * Dropzone config
     */
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
        },
        maxFiles: 1,
        maxSize: 500000,
        multiple: false,
    });

    /**
     * Handler for saving the profile picture
     */
    const handleSave = async () => {
        if (file !== null) {
            const data = new FormData();
            data.append("file", file);
            auth.updateProfilePic(data);
            props.onClose();
        } else {
            setNoFileErrorMessage(
                "Please upload a compatible file for your profile picture!"
            );
            setDropzoneErrorMessage("");
        }
    };

    return (
        <Modal open={props.open}>
            <Box sx={style}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        id="changePictureText"
                        variant="h6"
                        component="h2"
                    >
                        Change Profile Picture
                    </Typography>
                    <IconButton onClick={props.onClose}>
                        <Close />
                    </IconButton>
                </Box>

                <Paper
                    {...getRootProps({
                        sx: isDragActive
                            ? {
                                  ...dropzoneStyle,
                                  ...activeDropzoneStyle,
                              }
                            : dropzoneStyle,
                    })}
                >
                    <input {...getInputProps()} />
                    <CloudUpload style={{ fontSize: 48 }} />
                    {isDragActive ? (
                        <Typography>Drop the file here ...</Typography>
                    ) : (
                        <Typography>
                            Drag 'n' drop a file here, or click to select one
                            (.png, .jpg, .jpeg)
                        </Typography>
                    )}
                </Paper>
                {dropzoneErrorMessage ? (
                    <Alert severity="warning" sx={{ mt: "10px" }}>
                        {dropzoneErrorMessage}
                    </Alert>
                ) : (
                    file && (
                        <Alert severity="success" sx={{ mt: "10px" }}>
                            File Uploaded: {file.name}
                        </Alert>
                    )
                )}

                {noFileErrorMessage && (
                    <Alert severity="error" sx={{ mt: "10px" }}>
                        {noFileErrorMessage}
                    </Alert>
                )}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            color: "black",
                            width: "90px",
                            mr: "5px",
                        }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ color: "black" }}
                        onClick={props.onClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default MUIChangeProfilePicModal;
