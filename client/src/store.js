//temp global store
import { createContext, useState, useContext } from "react"
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

const geobuf = require("geobuf")
const Pbf = require("pbf")

export const GlobalStoreContext = createContext({})

export const GlobalStoreActionType = {
    SET_CURRENT_MODAL: "SET_CURRENT_MODAL",
    SET_CURRENT_BROWSE: "SET_CURRENT_BROWSE",
    SET_CURRENT_MAP: "SET_CURRENT_MAP",
}

function GlobalStoreContextProvider(props) {
    const { auth } = useContext(AuthContext)

    const [store, setStore] = useState({
        //access global state
        togglebrowseHome: true, //Nav Icon at home

        //reducer states
        currentMap: null,
        mapNameActive: false,

        currentMyMapCollection: null, // What to display on mymap and browsepage
        currentMarketplaceCollection: null,
        currentModal: null,
    });


    //Nav Global Handlers
    store.toggleBrowsePage = async (option) => {
        return setStore({
            ...store,
            togglebrowseHome: option == "home" ? true : false,
        })
    }

    store.createMap = async (title, fileType, mapTemplate, files) => {
        console.log(files)
        var buffer = geobuf.encode(files, new Pbf())
        console.log(buffer)

        const response = await api.createNewMap(title, mapTemplate, buffer)
    }

    store.getMyMapCollection = async (userId) => {
        const response = await api.getUserMaps(userId)
        return setStore({
            ...store,
            currentMyMapCollection: response.data.userMaps,
        })
    }

    store.renameMap = async (mapId, newName) => {
        // Call to backend API to update the map name
        console.log(mapId, newName)
        const response = await api.updateMapNameById(mapId, newName)
        console.log(response)

        if (response.success) {
            // Update the map name in the currentMyMapCollection state
            // Assuming each map object has an id and a name
            const updatedCollection = store.currentMyMapCollection.map(
                (map) => {
                    if (map.id === mapId) {
                        return { ...map, name: newName }
                    }
                    return map
                }
            )
            setStore({
                ...store,
                currentMyMapCollection: updatedCollection,
            })
        }
    } //Browse Global Handlers

    store.deleteMap = async (mapId) => {
        const response = await api.deleteMapById(mapId)
        console.log(response)
        if (response.success) {
            // Update the map name in the currentMyMapCollection state
            // Assuming each map object has an id and a name
            const updatedCollection = store.currentMyMapCollection.map(
                (map) => {
                    if (map.id === mapId) {
                        return { ...map, name: newName }
                    }
                    return map
                }
            )
            setStore({
                ...store,
                currentMyMapCollection: updatedCollection,
            })
        }
    }

    store.duplicateMap = async (mapId) => {
        console.log(mapId)
        const response = await api.createDuplicateMapById(mapId)
        console.log(response)
        if (response.success) {
            // Update the map name in the currentMyMapCollection state
            // Assuming each map object has an id and a name
            const updatedCollection = store.currentMyMapCollection.map(
                (map) => {
                    if (map.id === mapId) {
                        return { ...map, name: newName }
                    }
                    return map
                }
            )
            setStore({
                ...store,
                currentMyMapCollection: updatedCollection,
            })
        }
    }

    // store.publishMap = async

    //Map Card Global Handlers
    store.searchForMapBy = async (filter, string) => {
        let filteredArray = []

        if (string !== "") {
            if (filter == "mapName") {
                filteredArray = store.MapCollection.filter((item) => {
                    return item.title[0].includes(string)
                })
            } else if (filter == "username") {
                filteredArray = store.MapCollection.filter((item) => {
                    return item.user[0].includes(string)
                })
            } else if (filter == "tag") {
                //Need UI implemenation and Backend
                filteredArray = store.MapCollection.filter((item) => {
                    return item.tag[0].includes(string)
                })
            }
        }

        return setStore({
            ...store,
            MapCollection: filteredArray,
        })
    }

    store.sortMapBy = async (key, order) => {
        //key: 'alphabetical-order' or 'recent'
        //order: 'asc' for ascending, 'dec' for decending
        const sortedArray = [...store.MapCollection]
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
            MapCollection: sortedArray,
        })
    }

    // Modal Global Handlers
    const modalProps = {
        open: store.currentModal !== null, // Set open based on whether there is a modal to display
        onClose: () => store.setCurrentModal(null), // Set onClose to close the modal
    }

    store.setCurrentModal = (option, id) => {
        return setStore({
            ...store,
            currentModal: option,
            currentModalMapId: id,
        })
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
    )
}

export default GlobalStoreContext
export { GlobalStoreContextProvider }
