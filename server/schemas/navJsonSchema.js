const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const navJsonSchema = new Schema({
    features: [
        {
            geometry: {
                type: {
                    type: String,
                    required: [true, "no type given"]
                },
                coordinates: {
                    type: [Number],
                    required: [true, "no coords given"]
                }
            },
            properties: {
                type: Mixed
            },
            type: {
                type: String,
                required: [true, "no type given"]
            }
        }
    ],
    type: {
        type: String,
        required: [true, "no type given"]
    }
});

const navJsonModel = mongoose.model("navJsonModel", navJsonSchema);
module.exports = navJsonModel;