const mongoose = require("mongoose")
const Schema = mongoose.Schema

const passcodeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, "no user id given"],
        ref: "userProfile"
    },
    creationData: {
        default: Date.now(),
        type: Date
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