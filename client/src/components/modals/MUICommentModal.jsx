import React, { useState, useContext } from "react";
import {
    Box,
    Button,
    IconButton,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
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
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function MUICommentModal(props) {
    const theme = useTheme();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [commentText, setCommentText] = useState("");

    /**
     * Handler for when the user posts a comment
     */
    const handlePostComment = async () => {
        try {
            const response = await store.postComment(
                commentText,
                null,
                store.currentMap._id
            );

            if (response && response.status === 200) {
                props.onClose();
                // props.onAddComment(response); // Call the parent function with the new comment
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    return (
        <div>
            <Modal
                open={props.open}
                aria-labelledby="comment-modal-title"
                aria-describedby="comment-modal-description"
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
                            id="comment-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Comment
                        </Typography>

                        <IconButton onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box
                        component="form"
                        sx={{
                            "& .MuiTextField-root": { m: 1, width: "95%" },
                            mt: 2,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="standard-textarea"
                            placeholder="Type comment here..."
                            multiline
                            rows={4}
                            variant="standard"
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 2,
                                mr: 2,
                            }}
                        >
                            <Button
                                onClick={handlePostComment}
                                variant="contained"
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: "black",
                                    mr: "5px",
                                }}
                            >
                                Send{" "}
                            </Button>
                            <Button
                                onClick={props.onClose}
                                variant="outlined"
                                sx={{ color: "black", ml: "5px" }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
