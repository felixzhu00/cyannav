import React, { useState, useEffect, useContext, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
  Typography,
  Box,
  Menu,
  MenuItem,
  Paper,
  Button,
  IconButton,
  TextField,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import {
  Undo,
  Redo,
  Delete,
  KeyboardArrowDown,
  ThumbUp,
  ThumbDown,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";

import MUIExportMapModal from "./modals/MUIExportMapModal";
import MUIPublishMapModal from "./modals/MUIPublishMapModal";
import MUIAddFieldModal from "./modals/MUIAddFieldModal";
import MUICommentModal from "./modals/MUICommentModal";

import NavJSON from "./NavJSON";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";

function MapViewingPage() {
  const theme = useTheme();
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const { id } = useParams();

  const [value, setValue] = useState("1");

  const [currentModel, setCurrentModel] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [anchorElChoropleth, setAnchorElChoropleth] = useState(null);

  const [features, setFeatures] = useState([]);

  //trigger if textfield is unfocused
  const [focusedField, setFocusedField] = useState(null);
  const focusedFieldRef = useRef(null);

  //Runs on initial load
  useEffect(() => {
    if (id != null) {
      store.getMapById(id);
      store.getGeojson(id);
      store.setCurrentArea(-1);
    }
  }, [id]);

  useEffect(() => {
    if (store.geojson && store.geojson.features) {
      const updatedFeatures = store.geojson.features.map((feature) => {
        const originalFields = { ...feature.fields };
        if (originalFields.name === undefined) {
          originalFields.name = feature.properties.admin;
        }
        if (
          originalFields.radius === undefined &&
          (store.currentMap.mapType === "heatmap" ||
            store.currentMap.mapType === "pointmap")
        ) {
          originalFields.radius = 0;
        }
        return {
          ...feature,
          fields: originalFields,
        };
      });
      setFeatures(updatedFeatures);
    }
  }, [store.geojson]);

  // Separate useEffect for setting byFeature
  useEffect(() => {
    if (
      store.geojson &&
      store.geojson.features &&
      store.geojson.features[0].fields &&
      store.geojson.features[0].fields._byFeature
    ) {
      const currentFeature = store.geojson.features[0].fields._byFeature;
      if (store.geojson.features[0].fields.hasOwnProperty(currentFeature)) {
        store.setByFeature(store.geojson.features[0].fields._byFeature);
      }
    }
  }, [features]);

  useEffect(() => {
    // Compare current focusedField with the previous one
    if (
      features.length !== 0 &&
      focusedFieldRef.current !== focusedField &&
      !areFeaturesEqual(features, store.geojson.features)
    ) {
      store.setGeoJsonFeatures(features);
    }
    focusedFieldRef.current = focusedField;
  }, [focusedField, features]);

  const areFeaturesEqual = (featuresA, featuresB) => {
    if (featuresA.length !== featuresB.length) {
      return false;
    }

    for (let i = 0; i < featuresA.length; i++) {
      // Use a deep equality check for the fields property
      if (!deepEqual(featuresA[i].fields, featuresB[i].fields)) {
        return false;
      }
    }

    return true;
  };

  // Recursive deep equality check
  const deepEqual = (a, b) => {
    if (a === b) {
      return true;
    }

    if (
      typeof a !== "object" ||
      typeof b !== "object" ||
      a === null ||
      b === null
    ) {
      return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  };
  useEffect(() => {
    if (store.byFeature !== null) {
      addField("_byFeature", store.byFeature);
    }
  }, [store.byFeature]);

  useEffect(() => {
    if (store.byFeature !== null) {
      addField("_mapCenter", store.mapCenter);
    }
  }, [store.mapCenter]);

  useEffect(() => {
    if (store.byFeature !== null) {
      addField("_mapZoom", store.mapZoom);
    }
  }, [store.mapZoom]);

  //   useEffect(() => {
  //   if (store && features.length !== 0 && !areFeaturesEqual(features, store.geojson.features)) {
  //     store.setGeoJsonFeatures(features)
  //   }
  // }, [features]);

  // Temp way for now to add field, need a better way
  useEffect(() => {
    if (store && store.fieldString) {
      const key = store.fieldString;
      addField(key, "");
    }
  }, [store.fieldString]);

  // Handler to add a new field to the selected feature
  const addField = (key, value) => {
    setFeatures((prevFeatures) => {
      const updatedFeatures = prevFeatures.map((feature) => ({
        ...feature,
        fields: {
          ...feature.fields,
          [key]: value,
        },
      }));
      return updatedFeatures;
    });
    // await store.setGeoJsonFeatures(features);
  };

  const removeField = (key) => {
    setFeatures((prevFeatures) => {
      const updatedFeatures = prevFeatures.map((feature) => {
        const updatedFields = { ...feature.fields };
        delete updatedFields[key];
        return {
          ...feature,
          fields: updatedFields,
        };
      });

      return updatedFeatures;
    });

    //reset byFeature
    if (store.byFeature == key) {
      store.setByFeature(null);
    }
  };

  // Handler to change the value of a field in the selected feature
  const changeFieldValue = async (key, newValue) => {
    setFocusedField(key);
    setFeatures((prevFeatures) => {
      if (store.currentArea === -1) {
        // Feature not found, do nothing or handle accordingly
        return prevFeatures;
      }

      const updatedFeatures = [...prevFeatures];
      const updatedFeature = {
        ...updatedFeatures[store.currentArea],
        fields: {
          ...updatedFeatures[store.currentArea].fields,
          [key]: newValue,
        },
      };
      updatedFeatures[store.currentArea] = updatedFeature;
      return updatedFeatures;
    });
  };

  const [comments, setComments] = useState([]); // Used to store comments
  const addComment = (newCommentText) => {
    const newComment = {
      text: newCommentText,
      timestamp: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };
  const commentBubbleStyle = {
    // Comment bubble styling
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    maxWidth: "90%",
  };

  function isNumeric(str) {
    if (typeof str != "string") return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }
  /**
   * Like/Dislikes constants and states
   */

  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleChoroplethClick = (event) => {
    setAnchorElChoropleth(event.currentTarget);
  };

  const handleSelectedByFeature = (option) => {
    store.setByFeature(option);
    setAnchorElChoropleth(null);
  };

  const handleExport = () => {
    setCurrentModel("export");
  };
  const handlePublish = () => {
    setCurrentModel("publish");
  };
  const handleComments = () => {
    setCurrentModel("comment");
  };
  const handleEdit = () => {
    // Handle edit logic
  };
  const handleUndo = () => {
    // Handle edit logic
  };
  const handleRedo = () => {
    // Handle edit logic
  };
  const handleAddField = () => {
    setCurrentModel("addfield");
  };

  const handleLike = async () => {
    // handles likes
    await store.likeMap(store.currentMap._id);
  };

  const handleDislike = async () => {
    // handles dislikes
    await store.dislikeMap(store.currentMap._id);
  };

  const topLeft = () => {
    return (
      <Box
        sx={{
          boxSizing: "border-box",
          width: "100%",
          display: "flex",
          alignItems: "center",
          bgcolor: theme.palette.primary.main, // Use theme color
          padding: "10px",
          boxShadow: 4,
          zIndex: 1,
          position: "relative", // Ensure this element is positioned
        }}
      >
        {/* Left-aligned Buttons */}
        <Box sx={{ marginRight: "auto" }}>
          <Button
            variant="contained"
            onClick={handleExport}
            sx={{
              width: "100px",
              marginRight: "10px",
              backgroundColor: theme.palette.secondary.main,
              color: "black",
            }}
          >
            Export
          </Button>
          <Button
            disabled={isPublished}
            variant="contained"
            onClick={handlePublish}
            sx={{
              width: "100px",
              backgroundColor: theme.palette.secondary.main,
              color: "black",
            }}
          >
            Publish
          </Button>
        </Box>

        {/* Right-aligned Icons with like/dislike counts */}
        <Box display="flex" alignItems="center">
          {" "}
          {/* Ensure flex layout for this Box */}
          <IconButton
            disabled={!isPublished || !auth.loggedIn}
            id="likeBtn"
            onClick={handleLike}
            sx={{ color: hasLiked ? "black" : "default" }}
          >
            <ThumbUp />
          </IconButton>
          <Typography sx={{ mx: 1 }}>{store.likes}</Typography>{" "}
          {/* Added margin for spacing */}
          <IconButton
            disabled={!isPublished || !auth.loggedIn}
            id="dislikeBtn"
            onClick={handleDislike}
            sx={{ color: hasDisliked ? "black" : "default" }}
          >
            <ThumbDown />
          </IconButton>
          <Typography sx={{ mx: 1 }}>{store.dislikes}</Typography>{" "}
          {/* Added margin for spacing */}
        </Box>
      </Box>
    );
  };

  const topRight = () => {
    return (
      <Box
        gridArea={"topbar"}
        sx={{
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "flex-end",
          bgcolor: theme.palette.primary.main, // Use theme color
          padding: "4px",
          boxShadow: 4,
          height: "60px",
          zIndex: 1, // Increased z-index
          position: "relative", // Ensure this element is positioned
        }}
      >
        <Box sx={{ width: "100%", height: "relative" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="edit-comment-tab-bar"
          >
            <Tab
              id="editTab"
              sx={{ "&.Mui-selected": { color: "black" } }}
              onClick={handleEdit}
              value="1"
              label="Edit"
            />
            <Tab
              id="commentTab"
              sx={{ "&.Mui-selected": { color: "black" } }}
              onClick={handleEdit}
              value="2"
              label="Comment"
            />
          </Tabs>
        </Box>
      </Box>
    );
  };

  const mapView = () => {
    return (
      <Box
        gridArea={"mapview"}
        sx={{
          position: "relative", // Position the container relatively
          flex: "1",
          width: "100%",
          height: `calc(100vh - 121px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {store.geojson && <NavJSON data={store.geojson} />}
        <Box
          sx={{
            position: "absolute", // Absolutely position the button container
            bottom: 20, // Adjust as needed
            left: 20, // Adjust as needed
            zIndex: 1000, // Ensure it's above the map
          }}
        >
          {auth.loggedIn && (
            <IconButton
              id="undoBtn"
              sx={{
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "5px",
                color: "black",
                margin: "0 5px 0 0",
                border: "2px solid #ccc",
                "&:hover": {
                  backgroundColor: "#CCCCCC",
                },
              }}
              onClick={() => handleUndo()}
            >
              <Undo />
            </IconButton>
          )}
          {auth.loggedIn && (
            <IconButton
              id="redoBtn"
              sx={{
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "5px",
                color: "black",
                border: "2px solid #ccc",
                "&:hover": {
                  backgroundColor: "#CCCCCC",
                },
              }}
              onClick={() => handleRedo()}
            >
              <Redo />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  };

  const commentSide = () => {
    return (
      <Box
        sx={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "10px",
          height: "100%",
          width: "100%",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box>
          {/* Map through the comments and display them */}
          {comments.map((comment, index) => (
            <Paper key={index} sx={commentBubbleStyle}>
              <Typography variant="body1" key={index}>
                {comment.text}
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", marginTop: "5px" }}
              >
                <Typography variant="caption">Username</Typography>
                <br></br>
                {new Date(comment.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
        {auth.loggedIn && (
          <Button
            variant="contained"
            sx={{
              mt: "auto", // This ensures the margin is applied to the top, pushing the button to the bottom
              width: "100%", // Button takes full width of the sidebar
              color: "black",
              bgcolor: theme.palette.secondary.main,
            }}
            onClick={handleComments} // Replace with your own event handler
          >
            Add Comment
          </Button>
        )}
      </Box>
    );
  };

  const editBar = () => {
    const fieldEdit = () => {
      if (store.currentArea === -1) {
        return null;
      }
      const selectedFeature = features[store.currentArea];
      return (
        <>
          <Box
            key={"name"}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Box sx={{ alignSelf: "center", marginRight: "10px" }}>
              <Typography>Name:</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "flex-end",
              }}
            >
              <TextField
                value={
                  selectedFeature &&
                  selectedFeature.fields &&
                  selectedFeature.fields.name
                }
                onChange={(e) => changeFieldValue("name", e.target.value)}
                onBlur={() => setFocusedField(null)}
              />
              {/* No delete icon for 'name' */}
            </Box>
          </Box>

          {/* Mapping through other fields */}
          {selectedFeature &&
            selectedFeature.fields &&
            Object.entries(selectedFeature.fields).map(
              ([key, value]) =>
                key !== "name" &&
                key !== "_byFeature" &&
                key !== "_mapZoom" &&
                key !== "_mapCenter" && (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <Box sx={{ alignSelf: "center", marginRight: "10px" }}>
                      <Typography>{key}:</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignSelf: "flex-end",
                      }}
                    >
                      <TextField
                        value={value}
                        onChange={(e) => changeFieldValue(key, e.target.value)}
                        onBlur={() => setFocusedField(null)}
                      />
                      <IconButton onClick={() => removeField(key)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                )
            )}
        </>
      );
    };

    return (
      <Box
        gridArea={"editBar"}
        sx={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: `calc(100vh - 121px)`,
          width: "100%",
          padding: "10px",
          boxShadow: 1,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {store.currentArea == -1 ? (
          <Typography variant="h6">Choose an area to edit</Typography>
        ) : (
          <>
            <Box>{fieldEdit()}</Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "10px", // Adjust as needed
              }}
            >
              {auth.loggedIn && (
                <Button
                  id="addFieldBtn"
                  variant="contained"
                  color="primary"
                  onClick={handleAddField}
                  sx={{
                    marginBottom: "10px",
                    color: "black",
                    bgcolor: theme.palette.secondary.main,
                  }}
                >
                  + Add Field
                </Button>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ m: "10px" }}>
                  {store.currentMap && store.currentMap.mapType} by:
                </Typography>
                <Box sx={{ textAlign: "right" }}>
                  <Button
                    onClick={handleChoroplethClick}
                    variant="contained"
                    sx={{
                      color: "black",
                      width: "150px",
                      bgcolor: theme.palette.secondary.main,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span>{store.byFeature && store.byFeature}</span>
                      <KeyboardArrowDown />
                    </Box>
                  </Button>
                  <Menu
                    anchorEl={anchorElChoropleth}
                    open={Boolean(anchorElChoropleth)}
                    onClose={() => {
                      setAnchorElChoropleth(null);
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    {store.geojson &&
                      store.geojson.features &&
                      store.currentArea !== null &&
                      store.geojson.features[store.currentArea] &&
                      store.geojson.features[store.currentArea].fields &&
                      Object.entries(
                        store.geojson.features[store.currentArea].fields
                      ).map(([key, value]) => {
                        if (isNumeric(value) && key != "_byFeature") {
                          return (
                            <MenuItem
                              key={key}
                              onClick={() => handleSelectedByFeature(key)}
                            >
                              {key}
                            </MenuItem>
                          );
                        }
                        return null;
                      })}
                  </Menu>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    );
  };
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr", // 3:1 ratio for main content and sidebar
        // gridTemplateRows: '7vh auto', // Allocate 10vh for top bar, rest for content
        height: "auto", // Ensure the total height is 100vh
        overflow: "hidden", // Prevent any overflow
      }}
    >
      <Box
        sx={{
          gridColumn: "1",
          gridRow: "1",
          textAlign: "left",
          paddingTop: "1px",
        }}
      >
        {topLeft()}
      </Box>
      <Box
        sx={{
          gridColumn: "2",
          gridRow: "1",
          textAlign: "right",
          paddingTop: "1px",
        }}
      >
        {topRight()}
      </Box>
      <Box sx={{ gridColumn: "1", gridRow: "2" }}>{mapView()}</Box>
      <Box sx={{ gridColumn: "2", gridRow: "2" }}>
        {value === "1" ? editBar() : commentSide()}
      </Box>
      {currentModel === "export" && (
        <MUIExportMapModal
          open={currentModel === "export"}
          onClose={() => setCurrentModel("")}
        />
      )}
      {currentModel === "publish" && (
        <MUIPublishMapModal
          open={currentModel === "publish"}
          onClose={() => setCurrentModel("")}
        />
      )}
      {currentModel === "comment" && (
        <MUICommentModal
          open={currentModel === "comment"}
          onClose={() => setCurrentModel("")}
          onAddComment={addComment}
        />
      )}
      {currentModel === "addfield" && (
        <MUIAddFieldModal
          open={currentModel === "addfield"}
          onClose={() => setCurrentModel("")}
        />
      )}
    </Box>
  );
}

export default MapViewingPage;

// useEffect(() => {
//   if (store.geojson == null) {
//     store.getGeojson(id);
//   }
// }, [store.geojson, id]);
