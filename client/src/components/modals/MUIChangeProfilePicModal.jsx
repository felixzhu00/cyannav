import React, { useState, useContext } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { DropzoneArea } from 'react-mui-dropzone';
import { useTheme } from '@emotion/react';
import AuthContext from '../../auth'

function MUIChangeProfilePicModal({ open, onClose, onSave }) {
    const theme = useTheme();
    const { auth } = useContext(AuthContext);
    const [selectedFiles, setSelectedFiles] = useState(null);

    const handleFileChange = (files) => {
        setSelectedFiles(files);
    };

    const handleSave = async () => {
        if (selectedFiles && selectedFiles.length > 0) {
            const data = new FormData();
            data.append("file", selectedFiles[0])
            auth.updateProfilePic(data);
        }
        // onSave(selectedFiles[0])
        onClose();
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography id="changePictureText" variant="h6" component="h2">
                    Change Profile Picture
                </Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                    <DropzoneArea
                        onChange={handleFileChange}
                        filesLimit={1}
                        dropzoneText="Drag and drop an image file here or click. (.jpeg or .png)"
                        acceptedFiles={['image/jpeg', 'image/png']}
                        maxFileSize={500000}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" sx={{ bgcolor: theme.palette.primary.main, color: "black", width: "90px", mr: 1 }} onClick={handleSave}>Save</Button>
                    <Button variant="outlined" sx={{ color: "black" }} onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default MUIChangeProfilePicModal;
