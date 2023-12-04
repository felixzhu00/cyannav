const http = require("http")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const fileuploader = require("express-fileupload")
dotenv.config() // Loads .env

const hostname = process.env.SERVER_HOSTNAME
const port = process.env.SERVER_PORT
const clientPort = process.env.CLIENT_PORT ? process.env.CLIENT_PORT : ""

const app = express()

// MIDDLE WARE
app.use(express.urlencoded({ extend: true }))
app.use(
    cors({
        origin: [`http://${hostname}${clientPort}`], // TODO: change to https for production later
        credentials: true,
    })
)
app.use(express.json())
app.use(cookieParser())
app.use(fileuploader())

const authRouter = require("./routes/auth-router")
app.use("/auth", authRouter)
// const apiRouter = require("./routes/api-router")
// app.use("/api", apiRouter)
const mapapiRouter = require("./routes/mapapi-router")
app.use("/api", mapapiRouter)

// Initialize database connection
const db = require("./db")
db.on("error", console.error.bind(console, "MongoDB connection failed"))

// Run server
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => console.log(`Server running on port ${port}`))
}

module.exports = app
