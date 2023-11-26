const mongoose = require("mongoose")

// TODO: use environmental variables later.
mongoose.connect("mongodb://127.0.0.1:27017/build4").catch((e) => {
    console.error("Connection error:", e.message)
})

const db = mongoose.connection

module.exports = db
