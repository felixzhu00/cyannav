import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

function MUIChangeProfilePicModal({ open, onClose, onSave }) {
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
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default MUIChangeProfilePicModal;
