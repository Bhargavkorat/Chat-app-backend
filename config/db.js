const mongoose = require("mongoose")

// const connectDb = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         })
//         console.log("🚀 ~ file: db.js:10 ~ connectDb ~ conn:", conn.connection)
//         console.log("Database connected")
//     } catch (error) {
//         console.log("error", error.message)
//         process.exit()
//     }
// }
// module.exports = connectDb

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected")
}).catch((error) => {
    console.log(`${error} did not connect`)
});