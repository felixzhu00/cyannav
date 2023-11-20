const mongoose = require("mongoose")
const Schema = mongoose.Schema

const fieldDataSchema = new Schema({
    // TODO: (build4) TO BE IMPLEMENTED
})

const mapGraphicModel = mongoose.model("fieldData", fieldDataSchema)
module.exports = mapGraphicModel
