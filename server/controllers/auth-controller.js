const auth = require('../auth') // This is the auth manager, so some code should be abstracted to this file.
const User = require('../schemas/userProfileSchema')

loggedIn = async (req, res) => {
    return res.status(404).json({
        loggedIn: false,
        user: null,
        errorMessage: "?"
    })
}
login = async (req, res) => {}
logout = async (req, res) => {}
register = async (req, res) => {}
resetRequest = async (req, res) => {}
verifyCode = async (req, res) => {}
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