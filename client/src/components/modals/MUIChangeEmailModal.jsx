import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { useState, useRef, useEffect, useContext } from 'react';
import { useTheme } from '@emotion/react';
import AuthContext from '../../auth.js';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIChangeEmailModal(props) {
    const theme = useTheme();
    const { auth } = useContext(AuthContext);
    const [open, setOpen] = useState(props.open);
    const [newEmail, setNewEmail] = useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleClose = () => {
        setOpen(false)
        props.onClose()
    };

    const handleSave = async () => {
        try {
            await auth.updateEmail(newEmail, newEmail);
            handleClose()
        } catch (error) {
            setErrorMessage(error.message);
        }

    }

    const handleEmailChange = (event) => {
        setNewEmail(event.target.value);
    };



    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="change-email-modal-title"
                aria-describedby="change-email-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="change-email-modal-title" variant="h6" component="h2">
                            Change Email
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
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
                            disabled
                            type="email"
                            id="old-email"
                            label="Old Email"
                            defaultValue={auth.user.email}
                            fullWidth
                        />
                        <TextField
                            required
                            type="email"
                            id="new-email"
                            label="New Email"
                            defaultValue=""
                            fullWidth
                            onChange={(event) => {
                                handleEmailChange(event);
                                setErrorMessage('');
                            }}
                        />
                        {errorMessage && (
                            <Typography color="error" variant='subtitle2' sx={{ mt: 1, ml: 1 }}>
                                {errorMessage}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mr: 2 }}>
                            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: theme.palette.primary.main, color: "black", mr: "10px", width: "90px" }}>Save</Button>
                            <Button onClick={handleClose} variant="outlined" sx={{ color: "black" }}>Cancel</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
