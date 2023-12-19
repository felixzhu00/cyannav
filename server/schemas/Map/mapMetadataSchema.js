const mongoose = require("mongoose")
const Schema = mongoose.Schema

const mapMetadataSchema = new Schema({
    title: {
        type: String,
        required: [true, "No title has been provided"],
    },
    user: [
        {
            type: Schema.Types.ObjectID,
            ref: "userProfile",
            required: [true, "No user specified."],
        },
    ],
    like: [
        {
            type: Schema.Types.ObjectID,
            ref: "userProfile",
            default: [],
        },
    ],
    dislike: [
        {
            type: Schema.Types.ObjectID,
            ref: "userProfile",
            default: [],
        },
    ],
    mapType: {
        type: String,
        enum: [
            "heatmap",
            "distributiveflowmap",
            "pointmap",
            "3drectangle",
            "choroplethmap",
        ],
        required: [true, "No map type specified."],
    },
    published: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    geojsonId: {
        type: Schema.Types.ObjectID,
        ref: "geojson",
        required: [true, "No geojson have been specified."],
    },
    commentsId: [
        {
            type: Schema.Types.ObjectID,
            ref: "comment",
            default: [],
        },
    ],
    parentMapId: this,
    tags: {
        type: [String],
    },
    picture: Buffer,
})

const mapGraphicModel = mongoose.model("mapMetadata", mapMetadataSchema)
module.exports = mapGraphicModel
