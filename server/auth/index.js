const jwt = require("jsonwebtoken")

function authManager() {
    // Function ran in conjunction with none auth apis.
    verify = (req, res, next) => {
        console.log("AuthManager::verify")
        console.log("req: " + req)
        console.log("next: " + next)
        try {
            const token = req.cookies.access_token
            if (!token) {
                return res.status(401).json({
                    loggedIn: false,
                    username: null,
                    errorMessage: "Unauthorized",
                })
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)

            console.log("verified.userId: " + verified.userId)
            req.userId = verified.userId

            res.locals.userId = verified.userId

            next()
        } catch (err) {
            console.error(err)
            return res.status(401).json({
                loggedIn: false,
                username: null,
                errorMessage: "Unauthorized",
            })
        }
    }

    // Function used to verify user wiith auth apis
    verifyUser = (req) => {
        console.log("AuthManager::verifyUser")
        console.log("req: " + req)
        try {
            const token = req.cookies.access_token
            if (!token) {
                return null
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)
            return verified.userId
        } catch (err) {
            console.error(err)
            return null
        }
    }

    // Signs web token
    signToken = (userId) => {
        return jwt.sign({ userId: userId }, process.env.JWT_SECRET)
    }

    return this
}

const auth = authManager()
module.exports = auth
