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

export default function MUIChangePasswordModal(props) {
    const [open, setOpen] = React.useState(props.open);
    const handleClose = () => {
        setOpen(false)
        props.onClose()
    };

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="change-password-modal-title"
                aria-describedby="change-password-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="change-email-password-title" variant="h6" component="h2">
                            Change Password
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
                            margin="normal"
                            required
                            fullWidth
                            name="current-password"
                            label="Current Password"
                            type="password"
                            id="current-password"
                            autoComplete="current-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="new-password"
                            label="New Password"
                            type="password"
                            id="new-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="verify-new-password"
                            label="Verify New Password"
                            type="password"
                            id="verify-new-password"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mr: 2 }}>
                            <Button onClick={handleClose} variant="contained" sx={{ bgcolor: theme.palette.primary.main, color: "black", mr: '10px', width: "90px" }}>Save</Button>
                            <Button onClick={handleClose} variant="outlined" sx={{ color: "black" }}>Cancel</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
