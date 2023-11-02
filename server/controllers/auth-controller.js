const auth = require('../auth') // This is the auth manager, so some code should be abstracted to this file.
const User = require('../schemas/userProfileSchema')


loggedIn = async (req, res) => {
    return res.status(200).json({
        username: "Test",
        email: "test@test.com",
        picture: ""
    })
}

login = async (req, res) => {
    // Get info from req.

    // Send to auth manager

    // Return to user
    return res.status(200).json({
        username: "Test-login",
        email: "test@test.com",
        picture: ""
    })
}

logout = async (req, res) => {
    // Logsout
    // Invalid session

    return res.status(200).json({
        // Set cookie to expire
    })
}

register = async (req, res) => {
    // Get information from req

    // Send to auth manager

    // Return to user
    return res.status(200).json({
        username: "Test-register",
        email: "test@test.com",
        picture: ""
    })
}

resetRequest = async (req, res) => {
    // Get info from req

    // Send to auth manager

    // Return status
}

verifyCode = async (req, res) => {
    // Get code from req

    // Send to auth manager

    // Return status
}

updatePasscode = async (req, res) => {}
updateUsername = async (req, res) => {}
updateEmail = async (req, res) => {}
deleteAccount = async (req, res) => {}

module.exports = {
    loggedIn,
    login,
    logout,
    register,
    resetRequest,
    verifyCode,
    updatePasscode,
    updateUsername,
    updateEmail,
    deleteAccount
}