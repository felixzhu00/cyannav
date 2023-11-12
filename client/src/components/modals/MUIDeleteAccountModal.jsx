import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';
import { TextField } from '@mui/material';

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

export default function MUIDeleteAccountModal() {
    const [open, setOpen] = React.useState(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="delete-account-modal-title"
                aria-describedby="delete-account-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="delete-account-modal-title" variant="h6" component="h2">
                            Delete Your Account
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Typography id="delete-account-modal-description" variant="body1">
                        Fill in the information below to delete your account.<br></br>
                        Note: All your maps will be permanently removed.
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
                            margin="normal"
                            required
                            fullWidth
                            name="username"
                            label="Username"
                            type="text"
                            id="username"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            id="email"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mr: 2 }}>
                            <Button
                                onClick={handleClose}
                                variant="contained"
                                sx={{
                                    backgroundColor: "red",
                                    color: "black",
                                    mr: '10px'
                                }}
                            >
                                DELETE
                            </Button>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                sx={{
                                    color: "black",
                                }}
                            >
                                CANCEL
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div >
    );
}
