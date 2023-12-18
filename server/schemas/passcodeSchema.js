const mongoose = require("mongoose")
const Schema = mongoose.Schema

const passcodeSchema = new Schema({
    userEmail: {
        type: String,
        required: [true, "no user email given"],
    },
    creationDate: {
        type: Number,
        required: [true, "no creation date given"]
    },
    expirationData: {
        default: 600, //time in seconds -> 10 min
        type: Number
    },
    passcode: {
        required : true,
        type: String
    }
})

const passcodeModel = mongoose.model("passcode", passcodeSchema)
module.exports = passcodeModel