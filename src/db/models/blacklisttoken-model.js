

import mongoose from "mongoose";

const blacklisttokenSchema=new mongoose.Schema({
    tokenid:{
        type:String,
        required:true,
        unique:true
    },
    expiredat:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const blacklisttokenmodel=mongoose.models.blacklisttokenmodel || mongoose.model("blacklisttokenmodel",blacklisttokenSchema)
export default blacklisttokenmodel
