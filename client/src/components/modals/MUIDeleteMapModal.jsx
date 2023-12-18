import React, { useContext } from "react";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { GlobalStoreContext } from "../../store";
import AuthContext from "../../auth";

/**
 * Modal box style
 */
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function MUIDeleteMapModal(props) {
    const theme = useTheme();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const currentMapId = store.currentModalMapId;

    /**
     * Handler for when the user deletes a map
     */
    const handleDelete = async () => {
        await store.deleteMap(currentMapId);
        props.onClose();
        await store.getMyMapCollection(auth.user.userId);
    };

    return (
        <div>
            <Modal
                open={props.open}
                aria-labelledby="delete-map-modal-title"
                aria-describedby="delete-map-modal-description"
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
                            id="delete-map-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Delete Your Map
                        </Typography>
                        <IconButton onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Typography
                        id="delete-map-modal-description"
                        variant="body1"
                    >
                        Please confirm if you would like to delete this map.
                        <br></br>
                        Note: This map will be permanently deleted.
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                            mr: 2,
                        }}
                    >
                        <Button
                            onClick={handleDelete}
                            variant="contained"
                            sx={{
                                backgroundColor: "red",
                                color: "black",
                                mr: "10px",
                            }}
                        >
                            DELETE
                        </Button>
                        <Button
                            onClick={props.onClose}
                            variant="outlined"
                            sx={{
                                color: "black",
                            }}
                        >
                            CANCEL
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
