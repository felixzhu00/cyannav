import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';
import { TextField } from '@mui/material';
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

export default function MUIChangeUsernameModal(props) {
    // const [token, setToken] = useCookies(["user"]);

    const theme = useTheme();
    const { auth } = useContext(AuthContext);
    const [open, setOpen] = useState(props.open);
    const [newUsername, setNewUsername] = useState('');

    const [errorMessage, setErrorMessage] = React.useState('');

    const handleClose = () => {
        setOpen(false)
        props.onClose()
    };

    const handleSave = async () => {
        try {
            await auth.updateUsername(newUsername, newUsername);
            handleClose();
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const handleUsernameChange = (event) => {
        setNewUsername(event.target.value);
    };

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="change-username-modal-title"
                aria-describedby="change-username-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="change-username-modal-title" variant="h6" component="h2">
                            Change Username
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
                            id="outlined-disabled"
                            label="Old Username"
                            defaultValue={auth.user.username}
                            fullWidth
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="New Username"
                            defaultValue=""
                            fullWidth
                            onChange={(event) => {
                                handleUsernameChange(event);
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
