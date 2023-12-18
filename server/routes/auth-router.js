const express = require("express")
const auth = require("../auth")
const router = express.Router()
const AuthController = require("../controllers/auth-controller")


router.get("/loggedIn", AuthController.loggedIn)
router.post("/login", AuthController.login)
router.post("/logout", AuthController.logout)
router.post("/register", AuthController.register)
router.post("/reset", AuthController.resetRequest)
router.post("/verifyCode", AuthController.verifyCode)
router.post("/updatePasscodeNotLoggedIn", auth.verify, AuthController.updatePasscodeNotLoggedIn)
router.post("/updatePass", auth.verify, AuthController.updatePasscode)
router.post("/updateUsername", auth.verify, AuthController.updateUsername)
router.post("/updateEmail", auth.verify, AuthController.updateEmail)
router.post("/deleteAccount", auth.verify, AuthController.deleteAccount)
router.post("/updateProfilePic", auth.verify, AuthController.updateProfilePic)
module.exports = router
