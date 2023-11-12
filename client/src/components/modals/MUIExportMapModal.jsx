import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';
import { FormControl, RadioGroup, Radio, FormControlLabel, FormGroup } from '@mui/material';

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

export default function MUIExportMapModal(props) {
    const [open, setOpen] = React.useState(props.open);
    const handleClose = () => {
        setOpen(false)
        props.onClose()
    };

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="export-map-modal-title"
                aria-describedby="export-map-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="export-map-modal-title" variant="h6" component="h2">
                            Export Map
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 2,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <FormGroup>
                            <Typography sx={{ mb: 1 }}>Select the format you would like to export as:</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    name="map-file-type"
                                    defaultValue="jpeg"
                                    sx={{ ml: 2 }}
                                >
                                    <FormControlLabel value="jpeg" control={<Radio />} label="JPEG" />
                                    <FormControlLabel value="png" control={<Radio />} label="PNG" />
                                    <FormControlLabel value="navjson" control={<Radio />} label="NavJSON" />
                                </RadioGroup>
                            </FormControl>
                        </FormGroup>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: "cyan", color: "black", mr: '7px' }}>Export</Button>
                            <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: "cyan", color: "black", ml: '7px' }}>Cancel</Button> {/* CHANGE THE ONCLICK! */}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
