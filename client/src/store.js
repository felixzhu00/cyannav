//temp global store
import { createContext, useState } from 'react';
import MUIAddFieldModal from './components/modals/MUIAddFieldModal';
import MUIAddTagModal from './components/modals/MUIAddTagModal';
import MUIChangeEmailModal from './components/modals/MUIChangeEmailModal';
import MUIChangePasswordModal from './components/modals/MUIChangePasswordModal';
import MUIChangeProfilePicModal from './components/modals/MUIChangeProfilePicModal';
import MUIChangeUsernameModal from './components/modals/MUIChangeUsernameModal';
import MUICommentModal from './components/modals/MUICommentModal';
import MUICreateMapModal from './components/modals/MUICreateMapModal';
import MUIDeleteAccountModal from './components/modals/MUIDeleteAccountModal';
import MUIDeleteMapModal from './components/modals/MUIDeleteMapModal';
import MUIExportMapModal from './components/modals/MUIExportMapModal';
import MUIPublishMapModal from './components/modals/MUIPublishMapModal';
import api from './store-api'



export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SET_CURRENT_MODAL: "SET_CURRENT_MODAL",
    SET_CURRENT_BROWSE: "SET_CURRENT_BROWSE",
    SET_CURRENT_MAP: "SET_CURRENT_MAP",
};

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        //access global state
        togglebrowseHome: true, //Nav Icon at home

        //reducer states
        currentMap: null,
        mapNameActive: false,

        currentMapCollection: null, // What to display on mymap and browsepage
        currentModal: null,
    });

    

    //Nav Global Handlers
    store.toggleBrowsePage = function (option) {
        return setStore({
            ...store,
            togglebrowseHome: option == "home" ? true : false
        });
    }

    //Browse Global Handlers


    //Map Card Global Handlers



    // Moda Global Handlers
    const modalProps = {
        open: store.currentModal !== null, // Set open based on whether there is a modal to display
        onClose: () => store.setCurrentModal(null), // Set onClose to close the modal
    };


    store.setCurrentModal = function (option) {
        return setStore({
            ...store,
            currentModal: option
        });
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