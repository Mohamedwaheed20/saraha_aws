import Message from "../../../db/models/message-model.js"
import usermodel from "../../../db/models/user-model.js"


export const sendmessageService=async(req,res)=>{
    
    const {body,ownerId}=req.body
   
    const user=await usermodel.findById(ownerId)
    if (!user) {
        throw new Error("User not found")
    }
    const message=new Message({body,ownerId})
    await message.save()
    res.status(200).json({message:"Message sent successfully",message:message})
}

export const getmessageService=async(req,res)=>{
    const messages=await Message.find().populate([
        {
            path:"ownerId",
            select:"-password"
        }
    ])
    res.status(200).json({message:"Messages found successfully",messages:messages})
}