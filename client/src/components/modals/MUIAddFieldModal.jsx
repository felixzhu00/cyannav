import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIAddFieldModal(props) {
    const [open, setOpen] = useState(props.open);
    const handleClose = () => { 
        setOpen(false)
        props.onClose()
    };

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="add-field-modal-title"
                aria-describedby="add-field-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="add-field-modal-title" variant="h6" component="h2">
                            Add Field
                        </Typography>

                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Typography id="add-field-modal-description" variant='body1' component="body1">
                        What is the name of the field you would like to add?
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '95%' },
                            mt: 2,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            required
                            id="outlined-required"
                            label="Field"
                            defaultValue=""
                            fullWidth
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mr: 2 }}>
                            <Button
                                onClick={handleClose}
                                variant="contained"
                                sx={{
                                    backgroundColor: "cyan",
                                    color: "black",
                                    mr: "5px",
                                    width: '100px' // Set a fixed width
                                }}
                            >
                                Add
                            </Button>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                sx={{
                                    color: "black",
                                    ml: "5px",
                                    width: '100px' // Ensure the width is the same as the first button
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
