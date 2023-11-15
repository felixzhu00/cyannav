const auth = require('../auth') // This is the auth manager, so some code should be abstracted to this file.
const User = require('../schemas/userProfileSchema')


loggedIn = async (req, res) => {
        try {
            console.log('test')
        console.log("auth-controller::loggedIn")
        console.log("req: " + req)

        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null
            })
        }

        const loggedInUser = await User.findOne({_id: userId});
        if (!loggedInUser) {
            // TODO: deal with this.
        }

        return res.status(200).json({
            loggedIn: true,
            user: {
                username: loggedInUser.username,
                email: loggedInUser.email,
                picture: null // TODO: figure out profile picture
            }
        })
    } catch (err) {
        console.log(err)
        // TODO: revoke user token?
        return res.status(200).json({
            loggedIn: false,
            user: null
        })
    }
}

login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                loggedIn: false,
                user: null,
                errorMessage: "Required fields empty."
            })
        }

        // Find user
        const targetUser = await User.findOne({email: email})
        if (!targetUser) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Wrong email or password"
            })
        }

        // TODO: Hash password can compare here, plaintext for BUILD#1
        if (password != targetUser.password) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Wrong email or password"
            })
        }


        // TODO-NOW: Sign tokens
        return res.status(200).json({
            loggedIn: true,
            user: {
                username: targetUser.username,
                email: targetUser.email,
                picture: null // TODO: figure out profile picture
            }
        })
    } catch (err) {
        console.log(err)

        // TODO: figure out what should be returned here
        return res.status(200).json({
            loggedIn: false,
            user: null,
            errorMessage:"TODO-login"
        })
    }
}

register = async (req, res) => {
    try {
        const { email, username, password, passwordVerify } = req.body
    
        // Don't know if this should be handled on front-end
        if (password != passwordVerify) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Passwords does not match"
            })
        }
        // Maybe more password checks.

        // Check if email is already used
        var existingUser = await User.findOne({email: email})
        if (existingUser) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Email is already in use"
            })
        }

        // Check if username is already used
        existingUser = await User.findOne({username: username})
        if (existingUser) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Username is already taken"
            })
        }

        // TODO: Hashpassword

        const newUser = new User({email, password, username})
        const saved = await newUser.save()

        if (!saved) {
            // TODO: Failed to save new user.
        }

        // TODO: Sign toekn.

        return res.status(200).json({
            loggedIn: true,
            user: {
                username: saved.username,
                email: saved.email,
                picture: null // Since new user have no profile picture.
            }
        })
    } catch (err) {
        console.log(err)

        // TODO: deal with error
        return res.status(401).json({
            loggedIn: false,
            user: null,
            errorMessage: "register backend"
        })
    }
}


// To be implemented in later builds

logout = async (req, res) => {
    // Logsout
    // Invalid session

    return res.status(200).json({
        // Set cookie to expire
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
