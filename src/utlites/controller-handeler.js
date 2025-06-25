import authRouter from "../moudels/auth-moudel/auth-controller.js";
import { globalErrorHandler } from "../moudels/auth-moudel/service/middelware/error-handler-middelware.js";
import userRouter from "../moudels/user-moudel/user.controller.js";
import messageRouter from "../moudels/message/message-controller.js";

const routerHandler=(app)=>{
    
    app.use("/auth",authRouter);
    app.use("/user",userRouter);
    app.use("/message",messageRouter);

    app.use(globalErrorHandler)
 }
 
 export default routerHandler;