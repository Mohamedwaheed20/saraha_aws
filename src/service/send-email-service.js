
import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";
export const sendEmailService=async(
    {
        to,
        subject,
        html
    }
)=>{
    try {
        const transporter=nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASSWORD
            }
        })
        const info=await transporter.sendMail({
            from:`"no-reply"<${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        })

return info
        
    } catch (error) {
        console.log(error);
        return error
        
    }
}

const eventEmitter=new EventEmitter();
eventEmitter.on("sendEmail",(...args)=>sendEmailService(...args));
export default eventEmitter;
