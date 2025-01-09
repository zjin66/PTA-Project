var Express = require('express')
const connectDB = require('./db.js')

var app = Express()

connectDB()

app.listen(5555, () => {
    console.log("app is running")
})