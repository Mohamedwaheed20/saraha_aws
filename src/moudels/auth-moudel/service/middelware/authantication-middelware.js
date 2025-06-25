import blacklisttokenmodel from "../../../../db/models/blacklisttoken-model.js"
import jwt from "jsonwebtoken"
import usermodel from "../../../../db/models/user-model.js"


export const authanticationMiddleware=()=>{
    return async(req,res,next)=>{
    try {
        const {accesstoken}=req.headers
        if (!accesstoken) {
            throw new Error("Access token missing")
        }
        const decoded=jwt.verify(accesstoken,process.env.jwt_accesstoken)
        const isblacklisted=await blacklisttokenmodel.findOne({tokenid:decoded.jti})
        if (isblacklisted) {
            console.log("Token blacklisted");
            res.status(401).json({message:"Token blacklisted"})
        }
        const user=await usermodel.findById(decoded._id,`-password `)
        if (!user) {
            throw new Error("User not found")
        }
        req.loggedinuser=user
        req.loggedinuser.token={tokenid:decoded.jti,expiredat:decoded.exp}
        next()
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
}

export const authorizationMiddleware=(role)=>{
    return (req,res,next)=>{
        try {
            
            const {role:loggedinuserrole}=req.loggedinuser
           const isroleallowed=role.includes(loggedinuserrole)
           if (!isroleallowed) {
            throw new Error("Unauthorized")
           }
            next()
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong', error });
        }
    }
}