require('dotenv').config()
const express = require('express')
require("./config/db")
const app = express()
const cors = require("cors")
const cookie = require("cookie-parser")
const UserRouter = require("./routes/UserRoutes")
const ChatRouter = require("./routes/ChatRoutes")
const { notFound, errorHandler } = require('./middleware/errorMiddleWare')
var bodyParser = require('body-parser')
app.use(cors({ credentials: true, origin: ["http://localhost:3001"] }))


app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "500mb" }));
app.use(cookie())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/api/user", UserRouter)
app.use("/api/chat", ChatRouter)
// app.use(notFound)
// app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`port is listening on ${process.env.PORT}`);
})