import React, { useContext, useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GlobalStoreContext } from "../../store";
import { useTheme } from "@emotion/react";
import AuthContext from "../../auth";

/**
 * Modal box style
 */
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "400px",
};

export default function MUIAddTagModal(props) {
    const theme = useTheme();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);
    const currentMapId = store.currentModalMapId;

    useEffect(() => {
        console.log("test");
        const filteredMap = store.mapCollection.filter(
            (map) => map._id === currentMapId
        );
        setTags(filteredMap[0].tags);
    }, []);

    /**
     * Handler for when the user adds a tag
     */
    const handleAddTag = () => {
        if (inputValue.trim() !== "" && !tags.includes(inputValue)) {
            setTags([...tags, inputValue]);
        }
        setInputValue("");
        inputRef.current.focus();
    };

    /**
     * Handler for when the user wants to delete a tag
     */
    const handleRemoveTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    /**
     * Handler for when the user wants to save their tag creations/deletions
     */
    const handleSave = async () => {
        await store.updateMapTag(currentMapId, tags);
        await store.getMyMapCollection(auth.user.userId);
        props.onClose();
    };

    return (
        <Modal
            open={props.open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
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
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Add Tag to Map
                    </Typography>
                    <IconButton onClick={props.onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ mt: 2, display: "flex" }}>
                    <Box sx={{ flex: 1, marginRight: 4 }}>
                        <Typography sx={{ mb: 2 }}>
                            Type the tag you wish to add to the map:
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter a tag"
                            inputRef={inputRef} // Apply the ref to the TextField
                            autoFocus // Automatically focus when the modal opens
                        />
                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                onClick={handleAddTag}
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: "black",
                                }}
                                variant="contained"
                            >
                                Add Tag
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1, overflow: "auto", maxHeight: "175px" }}>
                        <Typography variant="h7">
                            Tags Associated with Map:
                        </Typography>
                        <List sx={{ overflow: "auto" }}>
                            {tags.map((tag, index) => (
                                <ListItem
                                    key={index}
                                    sx={{ padding: "1px 10px" }}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() =>
                                                handleRemoveTag(index)
                                            }
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={tag} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        sx={{ width: "90px", mr: "10px" }}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={props.onClose}
                        sx={{ color: "black" }}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
