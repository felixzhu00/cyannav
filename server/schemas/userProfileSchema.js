const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userProfileSchema = new Schema({
    email: {
        type: String,
        required: [true, "no email given"],
        maxLength: 50,
    },
    password: {
        type: String,
        required: [true, "no password given"],
    }, // Salted and hashed
    picture: Buffer,
    username: {
        type: String,
        required: [true, "no username given"],
        maxLength: 50,
    },
})

const userProfileModel = mongoose.model("userProfile", userProfileSchema)
module.exports = userProfileModel
