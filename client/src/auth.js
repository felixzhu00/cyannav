import React, { createContext, useEffect, useState } from "react";
// import { useHistory } from 'react-router-dom'
import api from './store-api'


const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    UPDATE_USERNAME: "UPDATE_USERNAME",
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        error: null,
    });




    useEffect(() => {
        auth.getLoggedIn();
    }, []);


    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    error: payload.error,
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: payload.error,
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: null,
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: payload.error,
                })
            }
            case AuthActionType.UPDATE_USERNAME: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: payload.error,
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            console.log(response.data.user)
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function (email, username, password, passwordVerify) {
        const response = await api.registerUser(email, username, password, passwordVerify);
        // console.log(response)
        if (response.status === 200) {

            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user,
                    error: null,
                }
            })
        } else {
            if (response.data.errorMessage) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        error: response.data.errorMessage
                    }
                })
            } else {
                console.log("There is no error message")
            }

        }
    }

    auth.loginUser = async function (email, password) {
        const response = await api.loginUser(email, password);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    loggedIn: true,
                }
            })
        } else {
            const errorMessage = response.data.errorMessage || "Login failed. Please try again.";
            throw new Error(errorMessage);
        }
    }

    auth.logoutUser = async function () {
        const response = await api.logoutUser();
        console.log(response)
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
        }
    }


    auth.updateUsername = async function (loginToken, newUsername) {
        const response = await api.updateUsername(newUsername, newUsername);
        console.log(response)
        if (response.status === 200) {
            await auth.getLoggedIn()
        }
    }

    auth.updateEmail = async function (loginToken, newEmail) {
        const response = await api.updateEmail(newEmail, newEmail);
        console.log(response)
        if (response.status === 200) {
            await auth.getLoggedIn()
        }
    }



    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };