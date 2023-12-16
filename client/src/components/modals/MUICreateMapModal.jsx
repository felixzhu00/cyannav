import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import {
    FormControl,
    RadioGroup,
    Radio,
    FormControlLabel,
    FormGroup,
    Select,
    MenuItem,
    InputLabel,
    TextField,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useTheme } from "@emotion/react";
import { GlobalStoreContext } from "../../store";
import AuthContext from "../../auth.js";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 750,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function MUICreateMapModal(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const theme = useTheme();

    const [open, setOpen] = useState(props.open);
    const [title, setTitle] = useState("Untitled");
    const [fileType, setFileType] = useState("shapefiles");
    const [template, setTemplate] = useState("heatmap");
    const [files, setFiles] = useState([]);
    const [allowedFileTypes, setAllowedFileTypes] = useState({
        "application/zip": [".zip"],
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileChange,
        accept: allowedFileTypes,
        maxFiles: 1,
        multiple: false,
    });

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    // Handler for changing radio buttons
    const handleFileTypeChange = (event) => {
        setFileType(event.target.value);
        switch (event.target.value) {
            case "shapefiles":
                setAllowedFileTypes({ "application/zip": [".zip"] });
                break;
            case "geojson":
                setAllowedFileTypes({ "application/json": [".json"] });
                break;
            case "kml":
                setAllowedFileTypes({
                    "application/vnd.google-earth.kml+xml": [".kml"],
                });
                break;
            case "navjson":
                setAllowedFileTypes({ "application/navjson": [".navjson"] });
                break;
            default:
                setAllowedFileTypes({});
                break;
        }
    };

    // Handler for map template drop-down menu changes
    const handleTemplateChange = (event) => {
        // drop down menu
        setTemplate(event.target.value);
    };

    // Handler to file out files that do not match the allowed file types
    const handleFileChange = (files) => {
        const filteredFiles = files.filter((file) =>
            allowedFileTypes.some((type) => file.name.endsWith(type))
        );
        // Set the filtered files to state
        setFiles(filteredFiles);
    };

    // Handler to create the map
    const handleCreateMap = async () => {
        await store.createMap(title, fileType, template, files);

        // closes modal
        setOpen(false);
        props.onClose();
        await store.getMyMapCollection(auth.user.userId);
    };

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="create-map-modal-title"
                aria-describedby="create-map-modal-description"
            >
                <Box sx={style}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            id="create-map-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Create Map
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            mt: 2,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Box
                            id="mapTitleBox"
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            Map Title:
                            <TextField
                                required
                                placeholder="Untitled"
                                onChange={(e) => setTitle(e.target.value)}
                                sx={{ ml: 2, width: "75%" }}
                            />
                        </Box>

                        <FormGroup
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={{ mr: 2 }}>
                                    Select map file type:
                                </Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <RadioGroup
                                        id="mapFileType"
                                        row
                                        name="map-file-type"
                                        defaultValue={"shapefiles"}
                                        onChange={handleFileTypeChange}
                                    >
                                        <FormControlLabel
                                            value="shapefiles"
                                            control={<Radio />}
                                            label="Shapefiles"
                                        />
                                        <FormControlLabel
                                            id="geojsonOption"
                                            value="geojson"
                                            control={<Radio />}
                                            label="GeoJSON"
                                        />
                                        <FormControlLabel
                                            value="kml"
                                            control={<Radio />}
                                            label="KML"
                                        />
                                        <FormControlLabel
                                            value="navjson"
                                            control={<Radio />}
                                            label="NavJSON"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </FormGroup>

                        <FormGroup
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={{ mr: 2 }}>
                                    Select your map template:
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 300 }}>
                                    <InputLabel id="template-select-label">
                                        Template
                                    </InputLabel>
                                    <Select
                                        labelId="template-select-label"
                                        id="template-select"
                                        value={template}
                                        label="Template"
                                        onChange={handleTemplateChange}
                                    >
                                        <MenuItem
                                            id="heatmapOption"
                                            value={"heatmap"}
                                        >
                                            Heat Map
                                        </MenuItem>
                                        <MenuItem value={"distributiveflowmap"}>
                                            Distributive Flow Map
                                        </MenuItem>
                                        <MenuItem value={"pointmap"}>
                                            Point Map
                                        </MenuItem>
                                        <MenuItem value={"choroplethmap"}>
                                            Choropleth Map
                                        </MenuItem>
                                        <MenuItem value={"3drectangle"}>
                                            3D Rectangle Map
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </FormGroup>

                        <Box
                            {...getRootProps({
                                sx: {
                                    mt: 2,
                                    border: "1px dashed grey",
                                    padding: "20px",
                                    textAlign: "center",
                                },
                            })}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Drop the file here ...</p>
                            ) : (
                                <p>
                                    Drag 'n' drop a file here, or click to
                                    select one (
                                    {Object.keys(allowedFileTypes)
                                        .flatMap((key) => allowedFileTypes[key])
                                        .join(", ")}
                                    )
                                </p>
                            )}
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 2,
                            }}
                        >
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                sx={{ color: "black", mr: "5px" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                id="createMapBtnFromMyMaps"
                                onClick={handleCreateMap}
                                variant="contained"
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: "black",
                                    ml: "5px",
                                }}
                            >
                                Create
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
