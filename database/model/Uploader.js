const mongoose = require('mongoose')

const UploaderSchema = new mongoose.Schema({
    id: String,
    unique_id: String,
    headline: String,
    description: String,
    price: String
})

const UploaderModel = mongoose.model("uploaders", UploaderSchema)
module.exports = UploaderModel