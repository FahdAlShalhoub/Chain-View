const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var address = new Schema ({
    userEmail:{
        type:String,
        required:true
    },
    publicKey:{
        type: String,
        required:true
    },
    addressKey:{
        type:String,
        required:true
    },
    WIP:{
        type:String
    }
})

module.exports = address = mongoose.model('address',address);