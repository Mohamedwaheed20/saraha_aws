import { compareSync, hashSync } from "bcrypt"
import blacklisttokenmodel from "../../../db/models/blacklisttoken-model.js"
import usermodel from "../../../db/models/user-model.js"
import { decruption, encription } from "../../../utlites/encryptiom.js"
import jwt from "jsonwebtoken"
import eventEmitter from "../../../service/send-email-service.js"
import Message from "../../../db/models/message-model.js"

export const profileService=async(req,res)=>{
   
        
     const{_id}=req.loggedinuser
        const user=await usermodel.findById(_id)
        if (!user) {
            throw new Error("User not found")
        }
       
        user.phonenumber=await decruption({cipher:user.phonenumber,secretkey:process.env.SECRET_KEY})
        res.status(200).json({message:"User found successfully",user:user})
    
}



export const updatepasswordService=async(req,res)=>{
    
        const{_id}=req.loggedinuser
        const {oldpassword,newpassword,confirmpassword}=req.body
        const user=await usermodel.findById(_id)
        if (!user) {
            throw new Error("User not found")
        }
        const isPasswordMatched=await compareSync(oldpassword,user.password)
        if(!isPasswordMatched){
            throw new Error("Invalid credentials")
        }
        if(newpassword!==confirmpassword){
            throw new Error("Password not matched")
        }
        const hashedpassword=await hashSync(newpassword,+process.env.SALT)
       user.password=hashedpassword
       await user.save()
       await blacklisttokenmodel.create(req.loggedinuser.token)
        res.status(200).json({message:"password updated successfully"})
    
}

export const updateprofileService=async(req,res)=>{
    
        const{_id}=req.loggedinuser
        const {username,email,phonenumber,age}=req.body
        const user=await usermodel.findById(_id)
        if (!user) {
            throw new Error("User not found")
        }
        user.username=username
      
        user.age=age
        if(phonenumber){
            user.phonenumber=await encription({value:phonenumber,secretkey:process.env.SECRET_KEY})
        }
        if(email){
            const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"1h"})
            const confirmationemail=`${req.protocol}://${req.headers.host}/auth/verify/${token}`
        
            eventEmitter.emit("sendEmail",{
                to:email,
                subject:"Verify your email",
                html:`<h1>Verify your email</h1><p>Click <a href="${confirmationemail}">here</a> to verify your email</p>`
            })
        
            user.email=email
            user.isverified=false
        }
        await user.save()
        res.status(200).json({message:"profile updated successfully",user:user})
}

export const listusersService=async(req,res)=>{
    
        const users=await usermodel.find()
        res.status(200).json({message:"Users found successfully",users:users})
}

export const getusermessagesService=async(req,res)=>{
    const{_id}=req.loggedinuser
    const messages=await Message.find({ownerId:_id}).populate([
        {
            path:"ownerId",
            select:"-password"
        }
    ])
    res.status(200).json({message:"Messages found successfully",messages:messages})
    
}