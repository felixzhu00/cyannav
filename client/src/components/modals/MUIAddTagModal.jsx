import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '300px'
};

export default function TagModal(props) {
    const [open, setOpen] = React.useState(props.open);
    const [tags, setTags] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');
    const inputRef = React.useRef(null); // Create a ref for the input field

    const handleClose = () => {
        setOpen(false)
        props.onClose()
    };
    const handleAddTag = () => {
        if (inputValue.trim() !== '') {
            setTags([...tags, inputValue]);
            setInputValue('');
            inputRef.current.focus(); // Focus the input field after adding a tag
        }
    };
    const handleRemoveTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Tag to Map
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ mt: 2, display: 'flex' }}>
                    <Box sx={{ flex: 1, marginRight: 4 }}>
                        <Typography sx={{ mb: 2 }}>Type the tag you wish to add to the map:</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter a tag"
                            inputRef={inputRef} // Apply the ref to the TextField
                            autoFocus // Automatically focus when the modal opens
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={handleAddTag} variant="contained">
                                Add Tag
                            </Button>
                            <Button onClick={handleClose} variant="outlined">
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1, overflow: 'auto', maxHeight: '175px' }}>
                        <Typography variant="h7">Tags Associated with Map:</Typography>
                        <List sx={{ overflow: 'auto' }}>
                            {tags.map((tag, index) => (
                                <ListItem
                                    key={index}
                                    sx={{ padding: '1px 10px' }}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTag(index)}>
                                            <CloseIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={tag} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
