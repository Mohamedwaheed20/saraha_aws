import mongoose from "mongoose";
import { userConstantRole } from "../../constant/user-constant.role.js";


const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
        
        
    },
    email: {
        type: String,
        required: true,    
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },  
    profileimage: {
        type: String,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
    isverified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    confirmPassword: {
        type: String,
    },
    role:{
        type:String,
        enum:Object.values(userConstantRole),
        default:userConstantRole.user
    }
    
},{
    timestamps:true
})

const usermodel=mongoose.models.usermodel || mongoose.model("USER",userSchema)
export default usermodel