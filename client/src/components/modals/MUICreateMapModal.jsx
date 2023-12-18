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
    Paper,
    Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import { useTheme } from "@emotion/react";
import { GlobalStoreContext } from "../../store";
import AuthContext from "../../auth.js";

/**
 * Modal box style
 */
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 750,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

/**
 * Dropzone style
 */
const dropzoneStyle = {
    mt: 2,
    border: "1px dashed grey",
    padding: "20px",
    textAlign: "center",
    transition: "border .3s ease-in-out",
};

/**
 * Style of the dropzone when the user drags a file on top of the dropzone
 */
const activeDropzoneStyle = {
    borderColor: "green",
    backgroundColor: "#f4f4f4",
};

export default function MUICreateMapModal(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const theme = useTheme();

    const [open, setOpen] = useState(props.open);
    const [title, setTitle] = useState("Untitled");
    const [fileType, setFileType] = useState("geojson");
    const [template, setTemplate] = useState("heatmap");
    const [file, setFile] = useState(null);
    const [allowedFileTypes, setAllowedFileTypes] = useState({
        "application/json": [".json"],
    });
    const [dropzoneErrorMessage, setDropzoneErrorMessage] = useState("");
    const [noFileErrorMessage, setNoFileErrorMessage] = useState("");
    const [uploadErrorMessage, setUploadErrorMessage] = useState("");

    /**
     * Check if the file being dropped is a valid file
     * @param {*} acceptedFiles files with correct extension
     * @param {*} fileRejections bad files
     */
    const onDrop = (acceptedFiles, fileRejections) => {
        console.log(acceptedFiles);
        console.log(fileRejections);
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setDropzoneErrorMessage("");
            setNoFileErrorMessage("");
        }
        if (fileRejections.length > 0) {
            setFile(null);
            setDropzoneErrorMessage(
                "Invalid file type. Please upload a compatible file."
            );
            setNoFileErrorMessage("");
        }
    };

    /**
     * Dropzone config
     */
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: allowedFileTypes,
        maxFiles: 1,
        multiple: false,
    });

    /**
     * Handler for closing the modal
     */
    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    /**
     * Handler for changing radio buttons
     * @param {*} event radio button
     */
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

    /**
     * Handler for map template drop-down menu changes
     * @param {*} event template
     */
    const handleTemplateChange = (event) => {
        setTemplate(event.target.value);
    };

    /**
     * Handler to create the map
     */
    const handleCreateMap = async () => {
        if (file === null) {
            setNoFileErrorMessage(
                "Please upload a compatible file to create map!"
            );
            setDropzoneErrorMessage("");
        } else {
            const response = await store.createMap(
                title,
                fileType,
                template,
                file
            );
            if (response.status == 400) {
                setUploadErrorMessage(response.data.errorMessage);
            } else {
                props.onClose();
            }
            await store.getMyMapCollection(auth.user.userId);
        }
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
                                        defaultValue={"geojson"}
                                        onChange={handleFileTypeChange}
                                    >
                                        <FormControlLabel
                                            id="geojsonOption"
                                            value="geojson"
                                            control={<Radio />}
                                            label="GeoJSON"
                                        />
                                        <FormControlLabel
                                            value="shapefiles"
                                            control={<Radio />}
                                            label="Shapefiles"
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

                        {fileType !== "navjson" && (
                            <FormGroup
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
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
                                            <MenuItem
                                                value={"distributiveflowmap"}
                                            >
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
                        )}
                        <Paper
                            {...getRootProps({
                                sx: isDragActive
                                    ? {
                                          ...dropzoneStyle,
                                          ...activeDropzoneStyle,
                                      }
                                    : dropzoneStyle,
                            })}
                        >
                            <input {...getInputProps()} />
                            <CloudUploadIcon style={{ fontSize: 48 }} />
                            {isDragActive ? (
                                <Typography>Drop the file here ...</Typography>
                            ) : (
                                <Typography>
                                    Drag 'n' drop a file here, or click to
                                    select one (
                                    {Object.keys(allowedFileTypes)
                                        .flatMap((key) => allowedFileTypes[key])
                                        .join(", ")}
                                    )
                                </Typography>
                            )}
                        </Paper>
                        {dropzoneErrorMessage ? (
                            <Alert severity="warning" sx={{ mt: "10px" }}>
                                {dropzoneErrorMessage}
                            </Alert>
                        ) : (
                            file && (
                                <Alert severity="success" sx={{ mt: "10px" }}>
                                    File Uploaded: {file.name}
                                </Alert>
                            )
                        )}
                        {noFileErrorMessage && (
                            <Alert severity="error" sx={{ mt: "10px" }}>
                                {noFileErrorMessage}
                            </Alert>
                        )}
                        {uploadErrorMessage && (
                            <Alert severity="error" sx={{ mt: "10px" }}>
                                {uploadErrorMessage}
                            </Alert>
                        )}

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
