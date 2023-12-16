import React, { useState, useContext } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useTheme } from "@emotion/react";
import AuthContext from "../../auth";

function MUIChangeProfilePicModal({ open, onClose, onSave }) {
    const theme = useTheme();
    const { auth } = useContext(AuthContext);
    const [file, setFile] = useState(null);

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    };

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

    const handleSave = async () => {
        if (file) {
            const data = new FormData();
            data.append("file", file);
            auth.updateProfilePic(data);
            onSave(file);
        }
        onClose();
    };

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

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography id="changePictureText" variant="h6" component="h2">
                    Change Profile Picture
                </Typography>
                <Box
                    {...getRootProps({
                        sx: {
                            mt: 2,
                            mb: 2,
                            border: "1px dashed grey",
                            padding: "20px",
                            textAlign: "center",
                        },
                    })}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the image file here...</p>
                    ) : (
                        <p>
                            Drag and drop an image file here or click. (.jpeg or
                            .png)
                        </p>
                    )}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            color: "black",
                            width: "90px",
                            mr: 1,
                        }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ color: "black" }}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default MUIChangeProfilePicModal;
