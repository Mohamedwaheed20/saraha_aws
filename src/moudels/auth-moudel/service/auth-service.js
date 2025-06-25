import { compareSync, hashSync } from "bcrypt"
import usermodel from "../../../db/models/user-model.js"
import { encription } from "../../../utlites/encryptiom.js"
import eventEmitter, { sendEmailService } from "../../../service/send-email-service.js"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from 'uuid';
import blacklisttokenmodel from "../../../db/models/blacklisttoken-model.js"

export const signupService=async(req,res)=>{
   try {
       
    const {username,email,password,phonenumber,age}=req.body
    const isUserExist=await usermodel.findOne({email})
    if(isUserExist){
        throw new Error("User already exists")
    }
    const hashedPassword=await hashSync(password,+process.env.SALT)
    const encryptedphonenumber=await encription({value:phonenumber,secretkey:process.env.SECRET_KEY})

    const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"1h"})
    const confirmationemail=`${req.protocol}://${req.headers.host}/auth/verify/${token}`

    eventEmitter.emit("sendEmail",{
        to:email,
        
        subject:"Verify your email",
        html:`<h1>Verify your email</h1><p>Click <a href="${confirmationemail}">here</a> to verify your email</p>`
    })

    const newuser= await usermodel.create({
        username,
        email,
        password:hashedPassword,
        phonenumber:encryptedphonenumber,
        age

 
    })
    res.status(201).json({message:"User created successfully",newuser:newuser})
   } catch (error) {

    console.log(error);
    res.status(500).json({ message: 'Something went wrong', error });

   }
}

export const verifyService=async(req,res)=>{
    try {
        const {token}=req.params
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user= await usermodel.findOneAndUpdate({email:decoded.email},{isverified:true},{new:true})
        if(!user){
            throw new Error("User not found")
        }
        res.status(200).json({message:"User verified successfully",user:user})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const signinService=async(req,res)=>{
    try {
        const{email,password}=req.body
        const user=await usermodel.findOne({email})
        if(!user){
            throw new Error("User not found")
        }
        const isPasswordMatched=await compareSync(password,user.password)
        if(!isPasswordMatched){
            throw new Error("Invalid credentials")
        }
        const accesstoken=jwt.sign({_id: user._id, email: user.email },process.env.jwt_accesstoken,{expiresIn:"2h",jwtid:uuidv4()})
        const refreshtoken=jwt.sign({_id: user._id, email: user.email },process.env.jwt_refreshtoken,{expiresIn:"1d",jwtid:uuidv4()})
        
        res.status(200).json({message:"User signed in successfully",accesstoken:accesstoken,refreshtoken:refreshtoken})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const refreshtokenService=async(req,res)=>{
    try {
        const {refreshtoken}=req.headers
        if (!refreshtoken) {
            throw new Error("Refresh token missing")
        }
        const decoded=jwt.verify(refreshtoken,process.env.jwt_refreshtoken)
        const user=await usermodel.findById(decoded._id)
        if (!user) {
            throw new Error("User not found")
        }
        const accesstoken=jwt.sign({_id: decoded._id, email: decoded.email },process.env.jwt_accesstoken,{expiresIn:"2h"})
        res.status(200).json({message:"refresh token generated successfully",accesstoken:accesstoken})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const signoutService=async(req,res)=>{
    try {
        const {accesstoken,refreshtoken}=req.headers 
       
        const decodedaccesstoken=jwt.verify(accesstoken,process.env.jwt_accesstoken)
        const decodedrefreshtoken=jwt.verify(refreshtoken,process.env.jwt_refreshtoken)
       const revokedtoken=blacklisttokenmodel.insertMany([
        {tokenid:decodedaccesstoken.jti,expiredat:decodedaccesstoken.exp},
        {tokenid:decodedrefreshtoken.jti,expiredat:decodedrefreshtoken.exp}
       ])
       if(!revokedtoken){
        throw new Error("Token not revoked")
       }
       res.status(200).json({message:"user signed out successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}


export const forgetpasswordService=async(req,res)=>{
    try {
        const {email}=req.body
        const user=await usermodel.findOne({email})
        if (!user) {
            throw new Error("User not found")
        }
       const otp=Math.floor(Math.random() * 100000)
        eventEmitter.emit("sendEmail",{
            to:user.email,
            subject:"RESET PASSWORD ",
            html:`<h1>RESET PASSWORD </h1>
            <p>your otp is ${otp}</p>`
        })
        const hashedotp=await hashSync(otp.toString(),10)
        user.otp=hashedotp
        await user.save()
        res.status(200).json({message:"otp sent successfully"})
      
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}


export const resetpasswordService=async(req,res)=>{
    try {
        const {email,otp,password,confirmpassword}=req.body
        const user=await usermodel.findOne({email})
        if (!user) {
            throw new Error("User not found")
        }
        const isOtpMatched=await compareSync(otp,user.otp)
        if(!isOtpMatched){
            throw new Error("Invalid credentials")
        }
        if(password!==confirmpassword){
            throw new Error("Password not matched")
        }
        const hashedpassword=await hashSync(password,+process.env.SALT)
       await usermodel.updateOne({email:email},{password:hashedpassword,$unset:{otp:""}})
        res.status(200).json({message:"password reset successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}