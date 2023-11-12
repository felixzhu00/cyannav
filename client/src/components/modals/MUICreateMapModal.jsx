import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';
import { FormControl, RadioGroup, Radio, FormControlLabel, FormGroup, Select, MenuItem, InputLabel } from '@mui/material';
import { DropzoneArea } from 'material-ui-dropzone';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUICreateMapModal() {
    const [open, setOpen] = React.useState(true);
    const [template, setTemplate] = React.useState('');
    const [files, setFiles] = React.useState([]);

    const handleClose = () => setOpen(false);
    const handleTemplateChange = (event) => setTemplate(event.target.value);
    const handleFileChange = (files) => {
        setFiles(files);
    };

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="create-map-modal-title"
                aria-describedby="create-map-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="create-map-modal-title" variant="h6" component="h2">
                            Create Map
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
                        <FormGroup sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ mr: 2 }}>Select map file type:</Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <RadioGroup
                                        row
                                        name="map-file-type"
                                    >
                                        <FormControlLabel value="shapefiles" control={<Radio />} label="Shapefiles" />
                                        <FormControlLabel value="geojson" control={<Radio />} label="GeoJSON" />
                                        <FormControlLabel value="kml" control={<Radio />} label="KML" />
                                        <FormControlLabel value="navjson" control={<Radio />} label="NavJSON" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </FormGroup>

                        <FormGroup sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ mr: 2 }}>Select your map template:</Typography>
                                <FormControl sx={{ m: 1, minWidth: 300 }}>
                                    <InputLabel id="template-select-label">Template</InputLabel>
                                    <Select
                                        labelId="template-select-label"
                                        id="template-select"
                                        value={template}
                                        label="Template"
                                        onChange={handleTemplateChange}
                                    >
                                        <MenuItem value={'heat map'}>Heat Map</MenuItem>
                                        <MenuItem value={'distributive flow map'}>Distributive Flow Map</MenuItem>
                                        <MenuItem value={'point map'}>Point Map</MenuItem>
                                        <MenuItem value={'choropleth map'}>Choropleth Map</MenuItem>
                                        <MenuItem value={'3d rectangle map'}>3D Rectangle Map</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </FormGroup>

                        <Box sx={{ mt: 2 }}>
                            <DropzoneArea
                                onChange={handleFileChange}
                                filesLimit={3}
                                dropzoneText="Drag files here, or click below!"
                                showPreviewsInDropzone={true}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: "cyan", color: "black", mr: '7px' }}>Cancel</Button>
                            <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: "cyan", color: "black", ml: '7px' }}>Create</Button> {/* CHANGE THE ONCLICK! */}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
