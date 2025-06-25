
import mongoose from "mongoose";


const messageSchema=mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"USER",
        required:true
    }
   
},{
    timestamps:true
})

const Message=mongoose.models.MESSAGE || mongoose.model("MESSAGE",messageSchema)
export default Message