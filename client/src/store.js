//temp global store
import { createContext, useState, useContext, useEffect } from "react"
import MUIAddFieldModal from "./components/modals/MUIAddFieldModal"
import MUIAddTagModal from "./components/modals/MUIAddTagModal"
import MUIChangeEmailModal from "./components/modals/MUIChangeEmailModal"
import MUIChangePasswordModal from "./components/modals/MUIChangePasswordModal"
import MUIChangeProfilePicModal from "./components/modals/MUIChangeProfilePicModal"
import MUIChangeUsernameModal from "./components/modals/MUIChangeUsernameModal"
import MUICommentModal from "./components/modals/MUICommentModal"
import MUICreateMapModal from "./components/modals/MUICreateMapModal"
import MUIDeleteAccountModal from "./components/modals/MUIDeleteAccountModal"
import MUIDeleteMapModal from "./components/modals/MUIDeleteMapModal"
import MUIExportMapModal from "./components/modals/MUIExportMapModal"
import MUIPublishMapModal from "./components/modals/MUIPublishMapModal"
import AuthContext from "./auth"
import api from "./store-api"

const geobuf = require('geobuf')
const Pbf = require('pbf')

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
        mapNameActive: false,

        mapCollection: null, // What to display on mymap and browsepage
        currentModal: null,
        //Map Viewing
        geojson: null,
        currentArea: null,

        //Add Field Modal
        fieldString: null,

        // Map likes and dislikes
        likes: 0,
        dislikes: 0
    })

    //Nav Global Handlers
    store.toggleBrowsePage = async (option) => {
        return setStore({
            ...store,
            togglebrowseHome: option == "home" ? true : false
        });
    }

    store.updateMapTag = async (mapId, tags) => {
        return await api.updateMapTag(mapId, tags);
    }

    store.createMap = async (title, fileType, mapTemplate, files) => {
        // console.log(files)

        // var buffer = geobuf.encode(files, new Pbf())
        // return await api.createNewMap(title, mapTemplate, buffer);

        const file = files[0]; // Assuming files is an array with the File object

        // Create a FileReader
        const reader = new FileReader();

        // Define the event handler for when the file read is complete
        reader.onloadend = async function (event) {
            if (event.target.readyState === FileReader.DONE) {
                // event.target.result contains the content of the file
                const geojson = JSON.parse(event.target.result);

                // Encode the GeoJSON with geobuf
                const buffer = geobuf.encode(geojson, new Pbf());

                const response = await api.createNewMap(title, mapTemplate, buffer);

                return response
            }
        };

        // Read the content of the file as text
        reader.readAsText(file);
    }


    store.getMyMapCollection = async (userId) => {
        if (!userId) return;  // Add this line

        const response = await api.getUserMaps(userId)
        setStore(prevStore => ({
            ...prevStore,
            mapCollection: response.data.userMaps,
        }));

        return response.data.userMaps
    }

    store.getMarketplaceCollection = async () => {
        const response = await api.getAllMaps()

        setStore({
            ...store,
            mapCollection: response.data.publishedMaps
        })
        return response.data.publishedMaps

    }

    store.renameMap = async (mapId, newName) => {
        // Call to backend API to update the map name
        await api.updateMapNameById(mapId, newName);
    }

    store.deleteMap = async (mapId) => {
        await api.deleteMapById(mapId);
    }

    store.duplicateMap = async (mapId) => {
        await api.createDuplicateMapById(mapId);
    }

    store.likeMap = async (id) => {
        const response = await api.likeMap(id);
        console.log(response);
        if (response.status === 200) {
            setStore(prevStore => ({
                ...prevStore,
                likes: response.data.metadata.like.length,
                dislikes: response.data.metadata.dislike.length,
            }));
        }
    }

    store.dislikeMap = async (id) => {
        const response = await api.dislikeMap(id);
        console.log(response);
        if (response.status === 200) {
            setStore(prevStore => ({
                ...prevStore,
                likes: response.data.metadata.like.length,
                dislikes: response.data.metadata.dislike.length,
            }));
        }
    }

    store.publishMap = async (mapId) => {
        await api.updateMapPublishStatus(mapId);
    }

    store.getGeojson = async (geojsonId) => {
        const response = await api.getGeoJsonById(geojsonId);
        if (response.status == 200) {

            // var geojson = geobuf.decode(new Pbf(response.data.geoBuf.arrayBuffer()));
            // console.log(geojson);
            // return geojson;

            // const uint8Array = new Uint8Array(response.data.geoBuf.data);

            // Use the Uint8Array directly in the Pbf constructor
            const pbf = new Pbf(response.data.geoBuf.data);

            // Decode the GeoJSON
            const geojson = geobuf.decode(pbf);


            setStore(prevStore => ({
                ...prevStore,
                geojson: geojson,
            }));

            return geojson;
        }
    }

    store.setCurrentArea = async (value) => {
        setStore(prevStore => ({
            ...prevStore,
            currentArea: value,
        }));
    }

    store.setField = async (value) => {
        setStore(prevStore => ({
            ...prevStore,
            fieldString: value,
        }));

    }

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
        let response

        if (store.togglebrowseHome) {
            response = await store.getMyMapCollection(auth.user.userId);
        } else {
            response = await store.getMarketplaceCollection();
        }

        let filteredArray = []

        // if (string !== "") {
        if (filter == "mapName") {
            filteredArray = response.filter((item) => {
                return item.title[0].includes(string)
            })
        } else if (filter == "username") {
            filteredArray = response.filter((item) => {
                return item.user[0].username.includes(string)
            })
        } else if (filter == "tag") {
            //Need UI implemenation and Backend
            filteredArray = response.filter((item) => {
                return item.tag[0].includes(string)
            })
        }
        // } 

        return setStore({
            ...store,
            mapCollection: filteredArray,
        })
    }

    store.sortMapBy = async (key, order) => {
        //key: 'alphabetical-order' or 'recent'
        //order: 'asc' for ascending, 'dec' for decending
        const sortedArray = [...store.mapCollection]

        sortedArray.sort((a, b) => {
            if (key === "alphabetical-order") {
                //'title' field
                const valueA = a.title[0].toString().toLowerCase()
                const valueB = b.title[0].toString().toLowerCase()
                return order === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA)
            } else if (key === "recent") {
                //'dateCreated' field
                const valueA = new Date(a.dateCreated).getTime()
                const valueB = new Date(b.dateCreated).getTime()
                return order === "dec" ? valueA - valueB : valueB - valueA
            } else if (key === "popularity") {
                // Need UI implementation to check
                //'like' and 'dislike' field
                const valueA = a.like.length - a.dislike.length
                const valueB = b.like.length - b.dislike.length
                return order === "dec" ? valueA - valueB : valueB - valueA
            }
            return 0 // Default to no sorting
        })

        return setStore({
            ...store,
            mapCollection: sortedArray,
        })
    }

    // Modal Global Handlers
    const modalProps = {
        open: store.currentModal !== null, // Set open based on whether there is a modal to display
        onClose: () => store.setCurrentModal(null), // Set onClose to close the modal
    };


    store.setCurrentModal = (option, id) => {

        setStore(prevStore => ({
            ...prevStore,
            currentModal: option,
            currentModalMapId: id,
        }));

    }

    store.setCurrentMap = (mapMeta) => {
        return setStore({
            ...store,
            currentMap: mapMeta
        })
    }

    store.getMapById = async (id) => {
        const response = await api.getMapById(id);
        console.log(response);
        console.log(auth.user);
        const userHasLiked = response.data.metadata.like.includes(auth.user.userId);
        console.log(userHasLiked);
        if (response.status === 200) {
            setStore(prevStore => ({
                ...prevStore,
                currentMap: response.data.metadata,
                likes: response.data.metadata.like.length,
                dislikes: response.data.metadata.dislike.length,
            }));
        }
    }



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