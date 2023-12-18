//temp global store
import { createContext, useState, useContext, useEffect } from "react";
import MUIAddFieldModal from "./components/modals/MUIAddFieldModal";
import MUIAddTagModal from "./components/modals/MUIAddTagModal";
import MUIChangeEmailModal from "./components/modals/MUIChangeEmailModal";
import MUIChangePasswordModal from "./components/modals/MUIChangePasswordModal";
import MUIChangeProfilePicModal from "./components/modals/MUIChangeProfilePicModal";
import MUIChangeUsernameModal from "./components/modals/MUIChangeUsernameModal";
import MUICommentModal from "./components/modals/MUICommentModal";
import MUICreateMapModal from "./components/modals/MUICreateMapModal";
import MUIDeleteAccountModal from "./components/modals/MUIDeleteAccountModal";
import MUIDeleteMapModal from "./components/modals/MUIDeleteMapModal";
import MUIExportMapModal from "./components/modals/MUIExportMapModal";
import MUIPublishMapModal from "./components/modals/MUIPublishMapModal";
import AuthContext from "./auth";
import api from "./store-api";

var tj = require("@mapbox/togeojson"),
    // node doesn't have xml parsing or a dom. use xmldom
    DOMParser = require("xmldom").DOMParser;

const JSZip = require("jszip");
import shp from "shpjs";

const geobuf = require("geobuf");
const Pbf = require("pbf");

import domtoimage from "dom-to-image";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SET_CURRENT_MODAL: "SET_CURRENT_MODAL",
    SET_CURRENT_BROWSE: "SET_CURRENT_BROWSE",
    SET_CURRENT_MAP: "SET_CURRENT_MAP",
};

function GlobalStoreContextProvider(props) {
    const { auth } = useContext(AuthContext);
    const [store, setStore] = useState({
        //access global state
        togglebrowseHome: true, //Nav Icon at home

        //reducer states
        currentMap: null,

        mapCollection: null, // What to display on mymap and browsepage
        currentModal: null,
        //Map Viewing
        geojson: null,
        currentArea: -1,
        byFeature: null,

        //Add Field Modal
        fieldString: null,

        // Map likes and dislikes
        likes: 0,
        dislikes: 0,

        // BrowsePage Sorting params
        sortBy: "recent",
        order: "asc",

        // Comment likes and dislikes
        commentLikes: 0,
        commentDislikes: 0,
    });

    useEffect(() => {
        if (store && store.geojson !== null && store.currentMap) {
            store.updateMapGeoJson();
        }
    }, [store.geojson]);

    useEffect(() => {
        if (store && store.mapCollection !== null) {
            store.sortMapBy(store.sortBy, store.order);
        }
    }, [store.sortBy, store.order]);

    store.setSortBy = async (sortBy) => {
        setStore((prevStore) => ({
            ...prevStore,
            sortBy: sortBy,
        }));
    };
    store.setOrder = async (order) => {
        setStore((prevStore) => ({
            ...prevStore,
            order: order,
        }));
    };

    //Nav Global Handlers
    store.toggleBrowsePage = async (option) => {
        // Check if the user is logged in
        if (auth.loggedIn || option !== "home") {
            // Allow toggle if user is logged in or if the option is not "home"
            return setStore({
                ...store,
                togglebrowseHome: option === "home",
            });
        } else {
            // If the user is not logged in and trying to access "My Maps", redirect to "Marketplace"
            return setStore({
                ...store,
                togglebrowseHome: false, // false corresponds to "Marketplace"
            });
        }
    };

    store.updateMapTag = async (mapId, tags) => {
        return await api.updateMapTag(mapId, tags);
    };

    store.createMap = async (title, fileType, mapTemplate, file) => {
        const mapFile = file;

        console.log("file", fileType);
        // Create a FileReader
        const reader = new FileReader();
        // Wrap the logic in a Promise
        const readPromise = () => {
            return new Promise((resolve, reject) => {
                // Define the event handler for when the file read is complete
                reader.onloadend = async function (event) {
                    if (event.target.readyState === FileReader.DONE) {
                        var geojson = undefined;
                        var tags = undefined;
                        switch (fileType) {
                            case "geojson":
                                geojson = JSON.parse(event.target.result);
                                break;
                            case "kml":
                                var kml = new DOMParser().parseFromString(
                                    event.target.result
                                );
                                geojson = tj.kml(kml);
                                break;
                            case "shapefiles":
                                await shp(event.target.result).then(
                                    function (shpgeojson) {
                                        geojson = shpgeojson;
                                    },
                                    function () {
                                        alert("Invalid shapefile zip.");
                                    }
                                );
                                break;
                            case "navjson":
                                const navjson = JSON.parse(event.target.result);
                                geojson = navjson.geojson;
                                mapTemplate = navjson.mapType;
                                tags = navjson.tags;
                                break;
                        }

                        // Encode the GeoJSON with geobuf
                        const buffer = geobuf.encode(geojson, new Pbf());

                        resolve(
                            api.createNewMap(title, mapTemplate, buffer, tags)
                        );
                    }
                };

                // Reject the promise if there's an error
                reader.onerror = function (event) {
                    reject(event.error);
                };
            });
        };

        if (fileType == "shapefiles") {
            // Read the content as array buffer for unzipping
            reader.readAsArrayBuffer(mapFile);
        } else {
            // Read the content of the file as text
            reader.readAsText(mapFile);
        }

        try {
            // Wait for the Promise to resolve
            const response = await readPromise();
            return response;
        } catch (error) {
            // Handle errors
            console.error("Error reading file:", error);
        }
    };

    store.getMyMapCollection = async (userId) => {
        if (!userId) return; // Add this line

        const response = await api.getUserMaps(userId);

        setStore((prevStore) => {
            const updatedStore = {
                ...prevStore,
                mapCollection: response.data.userMaps,
            };

            // Call sortMapBy after updating mapCollection
            return updatedStore;
        });

        await store.sortMapBy(store.sortBy, store.order);

        return response.data.userMaps;
    };

    store.getMarketplaceCollection = async () => {
        const response = await api.getAllMaps();

        setStore({
            ...store,
            mapCollection: response.data.publishedMaps,
        });
        return response.data.publishedMaps;
    };

    store.renameMap = async (mapId, newName) => {
        // Call to backend API to update the map name
        const response = await api.updateMapNameById(mapId, newName);

        return response;
    };

    store.deleteMap = async (mapId) => {
        await api.deleteMapById(mapId);
    };

    store.duplicateMap = async (mapId) => {
        await api.createDuplicateMapById(mapId);
    };

    store.forkMap = async (mapId) => {
        await api.createForkMapById(mapId);
    };

    store.likeMap = async (id) => {
        const response = await api.likeMap(id);
        if (response.status === 200) {
            setStore((prevStore) => ({
                ...prevStore,
                likes: response.data.metadata.like.length,
                dislikes: response.data.metadata.dislike.length,
            }));
        }
    };

    store.dislikeMap = async (id) => {
        const response = await api.dislikeMap(id);
        console.log(response);
        if (response.status === 200) {
            setStore((prevStore) => ({
                ...prevStore,
                likes: response.data.metadata.like.length,
                dislikes: response.data.metadata.dislike.length,
            }));
        }
    };

    store.publishMap = async (mapId) => {
        await api.updateMapPublishStatus(mapId);
    };

    store.getGeojson = async (geojsonId) => {
        const response = await api.getGeoJsonById(geojsonId);
        if (response.status == 200) {
            // Use the Uint8Array directly in the Pbf constructor
            const pbf = new Pbf(response.data.geoBuf.data);

            // Decode the GeoJSON
            const geojson = geobuf.decode(pbf);

            setStore((prevStore) => ({
                ...prevStore,
                geojson: geojson,
            }));

            return geojson;
        }
    };

    store.setCurrentArea = (value) => {
        setStore((prevStore) => {
            const updatedStore = {
                ...prevStore,
                currentArea: value,
            };

            return updatedStore;
        });
    };

    store.setField = async (value) => {
        setStore((prevStore) => ({
            ...prevStore,
            fieldString: value,
        }));
    };

    store.setGeoJsonFeatures = async (newFeatures) => {
        setStore((prevStore) => {
            const updatedGeojson = {
                ...prevStore.geojson,
                features: newFeatures,
            };

            return {
                ...prevStore,
                geojson: updatedGeojson,
            };
        });
    };

    //Map Card Global Handlers
    store.searchForMapBy = async (filter, string) => {
        let response;

        if (store.togglebrowseHome) {
            response = await store.getMyMapCollection(auth.user.userId);
        } else {
            response = await store.getMarketplaceCollection();
        }

        let filteredArray = [];

        // if (string !== "") {
        if (filter == "mapName") {
            filteredArray = response.filter((item) => {
                return item.title.includes(string);
            });
        } else if (filter == "username") {
            filteredArray = response.filter((item) => {
                return item.user[0].username.includes(string);
            });
        } else if (filter == "tag") {
            //Need UI implemenation and Backend
            filteredArray = response.filter((item) => {
                return item.tag[0].includes(string);
            });
        }
        // }

        // Update prevStore with the new filtered array
        setStore((prevStore) => ({
            ...prevStore,
            mapCollection: filteredArray,
        }));

        // Sort mapCollection based on your sorting logic
        store.sortMapBy(store.sortBy, "asc");
    };
    store.sortMapBy = async (key, order) => {
        setStore((prevStore) => {
            // key: 'alphabetical-order' or 'recent'
            // order: 'asc' for ascending, 'dec' for descending

            const sortedArray = [...prevStore.mapCollection];

            sortedArray.sort((a, b) => {
                if (key === "alphabetical-order") {
                    //'title' field
                    const valueA = a.title.toString().toLowerCase();
                    const valueB = b.title.toString().toLowerCase();
                    return order === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                } else if (key === "recent") {
                    //'dateCreated' field
                    const valueA = new Date(a.dateCreated).getTime();
                    const valueB = new Date(b.dateCreated).getTime();
                    return order === "dec" ? valueA - valueB : valueB - valueA;
                } else if (key === "most-liked") {
                    //'like' and 'dislike' field
                    const valueA = a.like.length - a.dislike.length;
                    const valueB = b.like.length - b.dislike.length;
                    return order === "dec" ? valueA - valueB : valueB - valueA;
                } else if (key === "most-disliked") {
                    const valueA = a.dislike.length;
                    const valueB = b.dislike.length;
                    return order === "asc" ? valueB - valueA : valueA - valueB;
                }
                return 0; // Default to no sorting
            });

            return {
                ...prevStore,
                mapCollection: sortedArray,
            };
        });
    };

    // Modal Global Handlers
    const modalProps = {
        open: store.currentModal !== null, // Set open based on whether there is a modal to display
        onClose: () => store.setCurrentModal(null), // Set onClose to close the modal
    };

    store.setCurrentModal = (option, id) => {
        setStore((prevStore) => ({
            ...prevStore,
            currentModal: option,
            currentModalMapId: id,
        }));
    };

    store.setCurrentMap = (mapMeta) => {
        return setStore({
            ...store,
            currentMap: mapMeta,
        });
    };

    store.getMapById = async (id) => {
        const response = await api.getMapById(id);
        if (response.status === 200) {
            setStore((prevStore) => ({
                ...prevStore,
                currentMap: response.data.metadata,
                likes: response.data.metadata.like.length,
                dislikes: response.data.metadata.dislike.length,
            }));
        }
    };

    store.updateMapGeoJson = async () => {
        const buffer = geobuf.encode(store.geojson, new Pbf());
        const response = await api.updateMapGeoJson(
            store.currentMap._id,
            buffer
        );
    };

    store.setByFeature = async (byFeatureOption) => {
        setStore((prevStore) => {
            return {
                ...prevStore,
                byFeature: byFeatureOption,
            };
        });
    };

    store.exportImage = async () => {
        const mapElement = Document.getElementById("map");

        // await new Promise((resolve) => tileLayer.on("load", () => resolve()));

        domtoimage
            .toPng(mapElement)
            .then(function (dataURL) {
                // var base64 = dataURL.split("base64,")[1]
                // var parseFile = new Parse.File(name, { base64: base64 })

                const tempLink = document.createElement("a");
                tempLink.href = dataURL;
                tempLink.download = "prettypicture.png";
                tempLink.click();
            })
            .catch(function (err) {
                console.log("THIS FAILE D WHAHSHASHDH");
            });
    };

    store.postComment = async (text, parentCommentId, mapId) => {
        const response = await api.postComment(text, parentCommentId, mapId);
        console.log(response);
        return response;
    };

    store.getCommentById = async (id) => {
        const response = await api.getcommentbyid(id);
        if (response.status === 200) {
            setStore((prevStore) => ({
                ...prevStore,
                commentLikes: response.data.upvotes.length,
                commentDislikes: response.data.downvotes.length,
            }));
        }
        return response.data;
    };

    // When the user likes a comment
    store.likeComment = async (id) => {
        const response = await api.likeComment(id);
        console.log(response);
        if (response.status === 200) {
            // Return the updated comment data by getting the comments again
            return;
        }
        return null;
    };

    // When the user dislikes a comment
    store.dislikeComment = async (id) => {
        const response = await api.dislikeComment(id);
        if (response.status === 200) {
            // Return the updated comment data by getting the comments again
            return;
        }
        return null;
    };

    return (
        <GlobalStoreContext.Provider value={{ store }}>
            {store.currentModal === "AddFieldModal" && (
                <MUIAddFieldModal {...modalProps} />
            )}
            {store.currentModal === "AddTagModal" && (
                <MUIAddTagModal {...modalProps} />
            )}
            {store.currentModal === "ChangeEmailModal" && (
                <MUIChangeEmailModal {...modalProps} />
            )}
            {store.currentModal === "ChangePasswordModal" && (
                <MUIChangePasswordModal {...modalProps} />
            )}
            {store.currentModal === "ChangeProfilePicModal" && (
                <MUIChangeProfilePicModal {...modalProps} />
            )}
            {store.currentModal === "ChangeUsernameModal" && (
                <MUIChangeUsernameModal {...modalProps} />
            )}
            {store.currentModal === "CommentModal" && (
                <MUICommentModal {...modalProps} />
            )}
            {store.currentModal === "DeleteAccountModal" && (
                <MUIDeleteAccountModal {...modalProps} />
            )}
            {store.currentModal === "DeleteMapModal" && (
                <MUIDeleteMapModal {...modalProps} />
            )}
            {store.currentModal === "ExportMapModal" && (
                <MUIExportMapModal {...modalProps} />
            )}
            {store.currentModal === "PublishMapModal" && (
                <MUIPublishMapModal {...modalProps} />
            )}
            {store.currentModal === "CreateMapModal" && (
                <MUICreateMapModal {...modalProps} />
            )}
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
