const mongoose = require("mongoose")

mongoose
    .connect(process.env.DATABASE_ADDR)
    .then(() => {
        // Drop database if node env is test
        if (
            process.env.NODE_ENV === "frontend_test" ||
            process.env.NODE_ENV === "test"
        ) {
            mongoose.connection.db.dropDatabase()
        }
    })
    .catch((e) => {
        console.error("Connection error:", e.message)
    })

const db = mongoose.connection

module.exports = db
