const mongoose = require("mongoose")
const Schema = mongoose.Schema

const geoJsonSchema = new Schema({
    // TODO: (build4) TO BE IMPLEMENTED
    geoBuf: {
        type: Buffer,
        required: true,
    },
})

const geoJsonModel = mongoose.model("geojson", geoJsonSchema)
module.exports = geoJsonModel
