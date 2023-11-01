const auth = require('../auth')
const User = require('../schemas/userProfileSchema')

loggedIn = async (req, res) => {}
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