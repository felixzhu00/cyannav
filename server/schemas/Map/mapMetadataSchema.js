const mongoose = require("mongoose")
const Schema = mongoose.Schema

const mapMetadataSchema = new Schema({
    title: [
        {
            type: String,
            required: [true, "No title has been provided"],
        },
    ],
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
        default: Date.now(),
    },
    thumbnail: {
        data: Buffer,
        type: String,
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
    fieldDataId: [
        {
            type: Schema.Types.ObjectID,
            ref: "geojson", // TODO: (later) change this to fieldData.
            required: [true, "No fieldData have been specified."],
        },
    ],
    parentMapId: this,
})

const mapGraphicModel = mongoose.model("mapMetadata", mapMetadataSchema)
module.exports = mapGraphicModel
