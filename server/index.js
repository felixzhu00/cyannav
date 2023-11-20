const http = require("http")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")

dotenv.config() // Loads .env

const hostname = process.env.SERVER_HOSTNAME
const port = process.env.SERVER_PORT
const clientPort = process.env.CLIENT_PORT

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

const authRouter = require("./routes/auth-router")
app.use("/auth", authRouter)
const apiRouter = require("./routes/api-router")
app.use("/api", apiRouter)

// Initialize database connection
const db = require("./db")
db.on("error", console.error.bind(console, "MongoDB connection failed"))

// Run server
app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = app
