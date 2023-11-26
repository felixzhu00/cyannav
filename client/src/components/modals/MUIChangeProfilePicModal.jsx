import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useTheme } from '@emotion/react';

function MUIChangeProfilePicModal({ open, onClose, onSave }) {
    const theme = useTheme();

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSave = () => {
        // Implement the logic to handle the file upload
        let newUrl = URL.createObjectURL(selectedFile);
        onSave(newUrl);
        onClose(); // Close the modal after saving
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Change Profile Picture</DialogTitle>
            <DialogContent>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Button onClick={handleSave} variant="contained" sx={{ bgcolor: theme.palette.primary.main, color: "black", mr: '5px' }}>Save</Button>
                <Button onClick={onClose} variant="outlined" sx={{ color: "black", ml: '5px' }}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default MUIChangeProfilePicModal;
