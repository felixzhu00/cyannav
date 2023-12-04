const auth = require("../auth") // This is the auth manager, so some code should be abstracted to this file.
const User = require("../schemas/userProfileSchema")

const bcrypt = require("bcrypt")
const saltRounds = 10

updateProfilePic = async (req, res) => {
    try {
        const userId = auth.verifyUser(req)
        if (!userId) {
            return res.status(401).json({ errorMessage: "Unauthorized" })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ errorMessage: "User not found" })
        }
        console.log(req.files.file)
        if (req.files.file) {
            const { data, mimetype } = req.files.file

            // Check if the file is of a valid image type
            if (!["image/jpeg", "image/png"].includes(mimetype)) {
                return res
                    .status(400)
                    .json({ errorMessage: "Invalid file type" })
            }

            user.picture = data
            await user.save()
            return res
                .status(200)
                .json({ message: "Profile picture updated successfully" })
        } else {
            return res.status(400).json({ errorMessage: "No file uploaded" })
        }
    } catch (err) {
        console.error("auth-controller::updateProfilePic")
        console.error(err)
        return res.status(500).end()
    }
}

loggedIn = async (req, res) => {
    try {
        var userId = auth.verifyUser(req)
        if (!userId) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                // errorMessage: "Invalid username or password.",
            })
        }

        const loggedInUser = await User.findOne({ _id: userId })
        if (!loggedInUser) {
            // TODO: decide what to do with this, loggedIn user is not found..
            return res.status(404).json({
                loggedIn: false,
                user: null,
                // errorMessage: "User not found.",
            })
        }

        return res.status(200).json({
            loggedIn: true,
            user: {
                username: loggedInUser.username,
                email: loggedInUser.email,
                picture: loggedInUser.picture, // TODO: figure out profile picture
                userId: userId,
            },
        })
    } catch (err) {
        console.error("auth-controller::loggedIn")
        console.error(err)

        return res.status(500).end()
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

        // Match password
        const match = await bcrypt.compare(password, targetUser.password)
        if (!match) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Wrong email or password",
            })
        }

        const token = auth.signToken(targetUser._id)

        return res
            .cookie("access_token", token, {
                httpOnly: true, // TODO: HTTPS: change this later when HTTPS is introduced.
                secure: false,
                // withCredentials: true,
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
        console.error("auth-controllers::login")
        console.error(err)

        return res.status(500).end()
    }
}

register = async (req, res) => {
    try {
        const { email, username, password, passwordVerify } = req.body
        console.log(req.body)
        if (!email || !username || !password || !passwordVerify) {
            console.log("HERE")
            return res.status(400).json({
                loggedIn: false,
                user: null,
                errorMessage: "Required fields empty.",
            })
        }

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
                errorMessage: "Email is already in use.",
            })
        }

        // Check if username is already used
        existingUser = await User.findOne({ username: username })
        if (existingUser) {
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Username is already taken.",
            })
        }

        const hashed_password = await bcrypt.hash(password, saltRounds)

        const newUser = new User({
            email: email,
            password: hashed_password,
            username: username,
        })
        const saved = await newUser.save()

        if (!saved) {
            return res.status(500).end()
        }

        const token = auth.signToken(newUser._id)

        return res
            .cookie("access_token", token, {
                httpOnly: true, // TODO: change this later when HTTPS is introduced.
                secure: false,
                sameSite: true,
            })
            .status(200)
            .json({
                loggedIn: true,
                user: {
                    username: saved.username,
                    email: saved.email,
                    picture: null, // Since new user have no profile picture.
                },
            })
    } catch (err) {
        console.error("auth-controller::register")
        console.error(err)

        return res.status(500).end()
    }
}

logout = async (req, res) => {
    res.cookie("access_token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: true,
    })
        .status(200)
        .send()
}

// TODO: To be implemented once email service is setup.

resetRequest = async (req, res) => {
    // Get info from req
    // Send to auth manager
    // Return status
    // send email
    // add verification code to database
}

verifyCode = async (req, res) => {
    // Get code from req
    // Send to auth manager
    // Return status
    // check code against databse
    // if yes, then ask
}

updatePasscode = async (req, res) => {
    try {
        //password variable is the value of the new password
        const { originalPassword, password, passwordVerify, verificationCode } =
            req.body

        if (!verificationCode && !originalPassword) {
            return res.status(400).end()
        }

        if (verificationCode && originalPassword) {
            return res.status(400).end()
        }

        if (password !== passwordVerify) {
            return res
                .status(401)
                .json({ errorMessage: "Passwords do not match." })
        }

        var userId
        if (originalPassword) {
            if (!res.locals.userId) {
                return res
                    .status(401)
                    .json({ errorMessage: "User is not logged in." })
            }
            userId = res.locals.userId

            const targetUser = await User.findById(userId)
            const match = await bcrypt.compare(
                originalPassword,
                targetUser.password
            )

            if (!match) {
                return res
                    .status(401)
                    .json({ errorMessage: "Incorrect original password." })
            }
        }

        if (verificationCode) {
            // TODO: (later)
            // match verification code
            // get userId from verification code.
        }

        const hashed_password = await bcrypt.hash(password, saltRounds)

        if (!hashed_password) {
            return res.status(500).end()
        }

        const success = await User.findByIdAndUpdate(userId, {
            password: hashed_password,
        })
        if (!success) {
            return res.status(500).end()
        }
        return res.status(200).end()
    } catch (err) {
        console.error("auth-controller::updatePassword")
        console.error(err)

        return res.status(500).end()
    }
}

// TODO: update documentation to remove login token from the following functions.
updateUsername = async (req, res) => {
    try {
        const { newUsername } = req.body

        if (!newUsername) {
            return res.status(400).end()
        }

        var existingUser = await User.findOne({ username: newUsername })
        if (existingUser) {
            return res.status(401).end()
        }

        var targetUser = await User.findOneAndUpdate(
            { _id: res.locals.userId },
            { username: newUsername }
        )

        if (!targetUser) {
            // This happens if the database went down during the request.
            return res.status(500).end()
        }

        return res.status(200).end()
    } catch (err) {
        console.err("auth-controller::updateUsername")
        console.err(err)
        return res.status(500).end()
    }
}

updateEmail = async (req, res) => {
    try {
        const { newEmail } = req.body

        if (!newEmail) {
            return res.status(400).end()
        }

        var existingUser = await User.countDocuments({ username: newEmail })
        if (existingUser > 0) {
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
            return res.status(500).end()
        }

        return res.status(200).end()
    } catch (err) {
        console.err("auth-controller::updateEmail")
        console.err(err)
        return res.status(500).end()
    }
}

deleteAccount = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).end()
        }

        if (res.locals.userId === null) {
            return res.status(401).end()
        }

        const currentUser = await User.findById(res.locals.userId)
        if (username !== currentUser.username) {
            return res.status(401).json({
                errorMessage: "Username does not match",
            })
        }
        if (email !== currentUser.email) {
            return res.status(401).json({
                errorMessage: "Email does not match.",
            })
        }
        const match = await bcrypt.compare(password, currentUser.password)
        if (!match) {
            return res.status(401).json({
                errorMessage: "Password does not match",
            })
        }

        var deleteUser = await User.findByIdAndDelete(res.locals.userId)
        if (deleteUser) {
            return res.status(200).end()
        } else {
            return res.status(500).end()
        }
    } catch (err) {
        console.err("auth-controller::deleteAccount")
        console.err(err)
        return res.status(500).end()
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
    updateProfilePic,
}
