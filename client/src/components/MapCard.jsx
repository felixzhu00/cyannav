import { useRef, useState, useContext, useEffect } from "react";
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme,
    TextField,
    Chip,
    Stack,
    Tooltip,
    Divider,
} from "@mui/material";
import { MoreVert, Publish, ThumbUp, ThumbDown } from "@mui/icons-material";
import { Link } from "react-router-dom";
import usgeojsonpng from "../assets/usgeojson.png";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";
import { useNavigate } from "react-router-dom";
import LoginLogo from "../assets/cyannav_logo_wo_name.png";

export default function MapCard({ map }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(map.title || "Unnamed Map");
    const [isPublished, setIsPublished] = useState(map.published);
    // States for managing chips
    const [visibleChips, setVisibleChips] = useState([]);
    const [noTagMessage, setNoTagMessage] = useState("");

    // States for renaming error
    const [renameError, setRenameError] = useState("");

    // Define the maximum length for a chip label
    const MAX_CHIP_LABEL_LENGTH = 10;
    const showChips = () => {
        if (map.tags.length != 0) {
            setVisibleChips(map.tags);
        } else {
            setVisibleChips(null);
            setNoTagMessage("No tags associated with map...");
        }
    };

    // Effect to calculate chips on mount and when map changes
    useEffect(() => {
        showChips();
    }, [map.tags, isSmallScreen]);

    useEffect(() => {
        setIsPublished(map.published);
    }, [map.published]);

    useEffect(() => {
        if (map && map.picture) {
            const arrayBuffer = new Uint8Array(map.picture.data).buffer;
            let blobType = "image/jpeg"; // Default to JPEG

            // Check if the buffer is a PNG by checking the first byte
            if (map.picture.data[0] === 137) {
                blobType = "image/png";
            }

            const blob = new Blob([arrayBuffer], { type: blobType });
            const imageUrl = URL.createObjectURL(blob);

            const img = new Image();

            if (!imageUrl) {
                img.src = LoginLogo;
            } else {
                img.src = imageUrl;
            }

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                const cropWidth = 400; // Set your desired width for cropping
                const cropHeight = 300; // Set your desired height for cropping

                img.onload = () => {
                    // Set canvas dimensions
                    canvas.width = cropWidth;
                    canvas.height = cropHeight;

                    // Draw the cropped region onto the canvas
                    // Adjust the cropping values as needed
                    ctx.drawImage(img, -30, -30, cropWidth, cropHeight);

                    // If you need to do something with the cropped image, you can use
                    // ctx.getImageData(0, 0, cropWidth, cropHeight) to get pixel data.
                };
            }
        }
    }, [map]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDoubleClick = () => {
        if (map.published === false) {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    };

    const handleChangeName = (event) => {
        setNewName(event.target.value);
    };

    const handleSubmitName = async () => {
        if (newName == map.title) {
            setIsEditing(false);
            return;
        }
        const response = await store.renameMap(map._id, newName);
        if (response.status !== 200) {
            setRenameError(response.data.errorMessage);
        } else {
            setIsEditing(false);
            // Sets the map.title instead of requerying api
            map.title = newName;
        }
    };

    const handleKebab = async (option) => {
        switch (option) {
            case "addTag":
                await store.setCurrentModal("AddTagModal", map._id);
                break;
            case "publish":
                await store.setCurrentModal("PublishMapModal", map._id);
                break;
            case "duplicate":
                await store.duplicateMap(map._id);
                await store.getMyMapCollection(auth.user.userId);
                break;
            case "fork":
                await store.forkMap(map._id);
                break;
            case "delete":
                await store.setCurrentModal("DeleteMapModal", map._id);
                break;
            default:
                console.log(`${option} is incorrect`);
        }
        setAnchorEl(null);
    };

    const handleNavToMap = async () => {
        await store.setCurrentMap(map);
        navigate(`/mapview/${map._id}`);
    };

    const renderMapImage = () => {
        if (map && map.picture) {
            const arrayBuffer = new Uint8Array(map.picture.data).buffer;
            let blobType = "image/jpeg"; // Default to JPEG

            // Check if the buffer is a PNG by checking the first byte
            if (map.picture.data[0] === 137) {
                blobType = "image/png";
            }

            const blob = new Blob([arrayBuffer], { type: blobType });
            const imageUrl = URL.createObjectURL(blob);

            const img = new Image();

            if (!imageUrl) {
                img.src = LoginLogo;
            } else {
                img.src = imageUrl;
            }

            return (
                <Link
                    id="mapImage"
                    onClick={handleNavToMap}
                    style={{ textDecoration: "none" }}
                >
                    <CardMedia
                        sx={{ height: 300, cursor: "pointer",  objectFit: "cover" }}
                        component="canvas"
                        ref={canvasRef}
                    />
                </Link>
            );
        } else {
            // Render a default image if map or map.picture is not available
            return (
                <Link
                    id="mapImage"
                    onClick={handleNavToMap}
                    style={{ textDecoration: "none" }}
                >
                    <CardMedia
                        sx={{ height: 300, cursor: "pointer", objectFit: "contain" }}
                        component="img"
                        src={LoginLogo} // Replace with your default image source
                        alt="Default Image"
                    />
                </Link>
            );
        }
    };

    return (
        <Card
            sx={{ maxWidth: isSmallScreen ? 300 : "relative", height: "100%" }}
        >
            <Box sx={{ position: "relative" }}>
                {renderMapImage()}

                {/* Likes and Dislikes Display with Icons and Vertical Divider */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        padding: "5px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <ThumbUp sx={{ color: "black" }} />
                    <Typography
                        sx={{
                            fontSize: "1rem",
                            color: "black",
                        }}
                    >
                        {map.like.length}
                    </Typography>

                    {/* Vertical Divider */}
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ bgcolor: "black" }}
                    />

                    <ThumbDown sx={{ color: "black" }} />
                    <Typography
                        sx={{
                            fontSize: "1rem",
                            color: "black",
                        }}
                    >
                        {map.dislike.length}
                    </Typography>
                </Box>

                {isPublished && (
                    <Publish
                        sx={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            color: "black",
                            fontSize: "50px",
                        }}
                    />
                )}
            </Box>
            <CardContent sx={{ bgcolor: theme.palette.background.paper }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {auth.loggedIn && isEditing ? (
                        <TextField
                            autoFocus
                            value={newName}
                            onChange={handleChangeName}
                            onBlur={handleSubmitName}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmitName();
                                }
                            }}
                            error={renameError !== ""}
                            helperText={renameError}
                        />
                    ) : (
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            onDoubleClick={handleDoubleClick}
                            sx={{
                                maxWidth: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {newName}
                        </Typography>
                    )}

                    {auth.loggedIn && (
                        <IconButton onClick={handleClick}>
                            <MoreVert />
                        </IconButton>
                    )}
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        {store.togglebrowseHome && (
                            <MenuItem
                                disabled={isPublished}
                                onClick={() => {
                                    handleKebab("addTag");
                                }}
                            >
                                Add Tag
                            </MenuItem>
                        )}
                        {store.togglebrowseHome && (
                            <MenuItem
                                disabled={isPublished}
                                onClick={() => {
                                    handleKebab("publish");
                                }}
                            >
                                Publish
                            </MenuItem>
                        )}
                        {store.togglebrowseHome && (
                            <MenuItem
                                onClick={() => {
                                    handleKebab("duplicate");
                                }}
                            >
                                Duplicate
                            </MenuItem>
                        )}
                        {!store.togglebrowseHome && (
                            <MenuItem
                                onClick={() => {
                                    handleKebab("fork");
                                }}
                            >
                                Fork
                            </MenuItem>
                        )}
                        {store.togglebrowseHome && (
                            <MenuItem
                                onClick={() => {
                                    handleKebab("delete");
                                }}
                            >
                                Delete
                            </MenuItem>
                        )}
                    </Menu>
                </Box>

                <Typography
                    id="createdByUser"
                    variant="body2"
                    color="text.secondary"
                >
                    By {map.user[0].username}
                </Typography>
                <Box sx={{ overflowX: "auto", maxWidth: "100%" }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: "10px", flexWrap: "nowrap" }}
                    >
                        {visibleChips &&
                            visibleChips.map((tag) => {
                                const isLongLabel =
                                    tag.length > MAX_CHIP_LABEL_LENGTH;
                                const displayLabel = isLongLabel
                                    ? `${tag.substring(
                                          0,
                                          MAX_CHIP_LABEL_LENGTH
                                      )}...`
                                    : tag;

                                return (
                                    <Tooltip
                                        key={tag}
                                        title={tag}
                                        placement="top"
                                        arrow
                                    >
                                        <Chip
                                            label={displayLabel}
                                            size="small"
                                        />
                                    </Tooltip>
                                );
                            })}
                    </Stack>
                </Box>

                {map.tags.length === 0 && (
                    <Typography variant="subtitle1">{noTagMessage}</Typography>
                )}
            </CardContent>
        </Card>
    );
}
