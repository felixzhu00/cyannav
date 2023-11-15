const auth = require("../auth") // This is the auth manager, so some code should be abstracted to this file.
const User = require("../schemas/userProfileSchema")

const bcrypt = require("bcrypt")
const saltRounds = 10

loggedIn = async (req, res) => {
    try {
        console.log("test")
        console.log("auth-controller::loggedIn")
        console.log("req: " + req)

        let userId = auth.verifyUser(req)
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "Invalid username or password.",
            })
        }

        const loggedInUser = await User.findOne({ _id: userId })
        if (!loggedInUser) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Invalid username or password.",
            })
        }

        return res.status(200).json({
            loggedIn: true,
            user: {
                username: loggedInUser.username,
                email: loggedInUser.email,
                picture: null, // TODO: figure out profile picture
            },
        })
    } catch (err) {
        console.log(err)
        // TODO: revoke user token?
        return res.status(200).json({
            loggedIn: false,
            user: null,
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
                errorMessage: "Required fields empty.",
            })
        }

        // Find user
        const targetUser = await User.findOne({ email: email })
        if (!targetUser) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Wrong email or password",
            })
        }

        bcrypt.compare(password, targetUser.password, function (result) {
            if (err) {
                // TODO: deal with this better.
                return res.status(500).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Internal server error.",
                })
            }

            if (!result) {
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Wrong email or password",
                })
            }
        })

        const token = auth.signToken(targetUser._id)

        return res
            .cookie("access_token", token, {
                httpOnly: true, // TODO: change this later when HTTPS is introduced.
                secure: true,
                sameSite: true,
            })
            .status(200)
            .json({
                loggedIn: true,
                user: {
                    username: targetUser.username,
                    email: targetUser.email,
                    picture: null, // TODO: figure out profile picture
                },
            })
    } catch (err) {
        console.log(err)

        // TODO: figure out what should be returned here
        return res.status(200).json({
            loggedIn: false,
            user: null,
            errorMessage: "TODO-login",
        })
    }
}

register = async (req, res) => {
    try {
        const { email, username, password, passwordVerify } = req.body

        if (password != passwordVerify) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Passwords does not match",
            })
        }

        // TODO: go over concrete to stay consistent with front-end.
        if (
            password.length < 9 ||
            [...password.matchAll(/[0-9]/g)].length == 0 || // numbers
            [...password.matchAll(/\W/g)].length < 2 // Special characters
        ) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Password fails security requirement.",
            })
        }

        // Check if email is already used
        var existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Email is already in use",
            })
        }

        // Check if username is already used
        existingUser = await User.findOne({ username: username })
        if (existingUser) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Username is already taken",
            })
        }

        var hashed_password
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                return res.status(500).json({
                    loggedIn: false,
                    errorMessage: "Internal server error.",
                })
            }

            hashed_password = hash
        })

        const newUser = new User({ email, hashed_password, username })
        const saved = await newUser.save()

        if (!saved) {
            return res.status(500).json({
                loggedIn: false,
                errorMessage: "Internal server error.",
            })
        }

        const token = auth.signToken(newUser._id)

        return res
            .status(200)
            .cookie("access_token", token, {
                httpOnly: true, // TODO: change this later when HTTPS is introduced.
                secure: true,
                sameSite: true,
            })
            .json({
                loggedIn: true,
                user: {
                    username: saved.username,
                    email: saved.email,
                    picture: null, // Since new user have no profile picture.
                },
            })
    } catch (err) {
        console.log(err)

        // TODO: deal with error
        return res.status(401).json({
            loggedIn: false,
            user: null,
            errorMessage: "register backend",
        })
    }
}

logout = async (req, res) => {
    // This should be enough... front end needs to redirect to homepage.
    return res.clearCookie("access_token").status(200)
}

// TODO: To be implemented once email service is setup.

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

// TODO: update documentation to remove login token from the following functions.
updateUsername = async (req, res) => {
    try {
        const { newUsername } = req.body

        var existingUser = await User.findOne({ username: newUsername })
        if (existingUser) {
            return res.status(401).json({
                errorMessage: "Username not unique.",
            })
        }

        var targetUser = await User.findOneAndUpdate(
            { _id: res.locals.userId },
            { username: newUsername }
        )

        if (!targetUser) {
            // This happens if the database went down during the request.
            return res.status(500)
        }

        return res.status(200)
    } catch (err) {
        return res.status(500)
    }
}

updateEmail = async (req, res) => {
    try {
        const { newEmail } = req.body

        var existingUser = await User.findOne({ username: newEmail })
        if (existingUser) {
            return res.status(401).json({
                errorMessage: "Email not unique.",
            })
        }

        var targetUser = await User.findOneAndUpdate(
            { _id: res.locals.userId },
            { email: newEmail }
        )

        if (!targetUser) {
            // This happens if the database went down during the request.
            return res.status(500)
        }

        return res.status(200)
    } catch (err) {
        return res.status(500)
    }
}

deleteAccount = async (req, res) => {
    try {
        var deleteUser = await User.findOne({ _id: res.locals.userId })
        if (deleteUser.ok === 1) {
            return res.status(200)
        } else {
            return res.status(401) // TODO: maybe change to 500?
        }
    } catch (err) {
        return res.status(500)
    }
}

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
    deleteAccount,
}
