const date = new Date(Date.now())

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const mapGraphicSchema = new Schema({
    comments: [
        {
            type: Schema.Types.ObjectID,
            ref: "commentSchema",
            default: [],
        },
    ],
    dateCreated: {
        type: Date,
        default: date,
    },
    dislike: [
        {
            type: Schema.Types.ObjectID,
            ref: "userProfileSchema",
            default: [],
        },
    ],
    dislike: [
        {
            type: Schema.Types.ObjectID,
            ref: "userProfileSchema",
            default: [],
        },
    ],
    mapType: {
        type: String,
        required: [true, "no mapType given"],
    },
    navjson: {
        type: Schema.Types.ObjectID,
        ref: "navJsonSchema",
        required: [true, "no navJson map given"],
    },
    published: {
        type: Boolean,
        default: false,
    },
    tags: [
        {
            type: Schema.Types.ObjectID,
            ref: "tagSchema",
            default: [],
        },
    ],
    title: {
        type: String,
        required: [true, "no title given"],
        maxLength: 50,
    },
    user: {
        type: Schema.Types.ObjectID,
        ref: "userProfileSchema",
        required: [true, "no user given"],
    },
})

const mapGraphicModel = mongoose.model("mapGraphicModel", mapGraphicSchema)
module.exports = mapGraphicModel
