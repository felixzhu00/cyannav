import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import IconButton from "@mui/material/IconButton"
import { Close } from "@mui/icons-material"
import {
    FormControl,
    RadioGroup,
    Radio,
    FormControlLabel,
    FormGroup,
} from "@mui/material"
import { useTheme } from "@emotion/react"
import domtoimage from "dom-to-image"
import { useState, useContext } from "react"
import { GlobalStoreContext } from "../../store"

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
}

export default function MUIExportMapModal(props) {
    const theme = useTheme()
    const [fileType, setFileType] = useState("jpeg")
    const { store } = useContext(GlobalStoreContext)

    const [open, setOpen] = React.useState(props.open)
    const handleClose = () => {
        setOpen(false)
        props.onClose()
    }

    const handleExport = (event) => {
        const mapElement = document.getElementById("map")

        switch (fileType) {
            case "jpeg":
                domtoimage
                    .toJpeg(mapElement) // Creates image
                    .then(function (dataURL) {
                        // Temporary link to created image
                        const tempLink = document.createElement("a")
                        tempLink.href = dataURL
                        tempLink.download = `${store.currentMap.title}.jpeg`
                        // Click on behalf of user
                        tempLink.click()
                    })
                    .catch(function (err) {
                        alert("JPEG export failed") // Simple alert for edge case
                    })
                break
            case "png":
                domtoimage
                    .toPng(mapElement) // Creates image
                    .then(function (dataURL) {
                        // Temporary link to created image
                        const tempLink = document.createElement("a")
                        tempLink.href = dataURL
                        tempLink.download = `${store.currentMap.title}.png`
                        // Click on behalf of user
                        tempLink.click()
                    })
                    .catch(function (err) {
                        alert("PNG export failed") // Simple alert for edge case
                    })
                break
            case "navjson":
                const navjson = {
                    title: store.currentMap.title,
                    mapType: store.currentMap.mapType,
                    tags: store.currentMap.tags,
                    geojson: store.geojson,
                }
                // Convert to json text document
                const navJsonStr =
                    "data:text/json;charset=utf-8," +
                    encodeURIComponent(JSON.stringify(navjson))

                // Temp link to download form
                const tempLink = document.createElement("a")
                tempLink.href = navJsonStr
                tempLink.download = `${store.currentMap.title}.navjson`
                // Click temp link
                tempLink.click()
                break
        }
    }

    const handleTypeChange = (e) => {
        setFileType(e.target.value)
    }

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="export-map-modal-title"
                aria-describedby="export-map-modal-description"
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
                            id="export-map-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Export Map
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
                        <FormGroup>
                            <Typography id="exportMapModalText" sx={{ mb: 1 }}>
                                Select the format you would like to export as:
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    name="map-file-type"
                                    defaultValue="jpeg"
                                    onChange={handleTypeChange}
                                    sx={{ ml: 2 }}
                                >
                                    <FormControlLabel
                                        value="jpeg"
                                        control={<Radio />}
                                        label="JPEG"
                                    />
                                    <FormControlLabel
                                        value="png"
                                        control={<Radio />}
                                        label="PNG"
                                    />
                                    <FormControlLabel
                                        value="navjson"
                                        control={<Radio />}
                                        label="NavJSON"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </FormGroup>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 2,
                            }}
                        >
                            <Button
                                id="exportBtnOnModal"
                                onClick={handleExport}
                                variant="contained"
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: "black",
                                    mr: "5px",
                                }}
                            >
                                Export
                            </Button>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                sx={{ color: "black", ml: "5px" }}
                            >
                                Cancel
                            </Button>{" "}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}
