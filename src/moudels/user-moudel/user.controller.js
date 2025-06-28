import { Router } from "express";
import * as userservice from "./service/profile-service.js";
import { userConstantRole } from "../../constant/user-constant.role.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
import { authanticationMiddleware, authorizationMiddleware } from "../../middelware/authantication-middelware.js";
const usercontroller = Router();

usercontroller.get('/profile',authanticationMiddleware(), errorHandler(userservice.profileService));
usercontroller.patch('/updatepassword',authanticationMiddleware(), errorHandler(userservice.updatepasswordService));
usercontroller.put('/updateprofile',authanticationMiddleware(), errorHandler(userservice.updateprofileService));
usercontroller.get('/listusers',authanticationMiddleware(), authorizationMiddleware([userConstantRole.admin,userConstantRole.superadmin,userConstantRole.user]), errorHandler(userservice.listusersService));
usercontroller.get('/getusermessages',authanticationMiddleware(), errorHandler(userservice.getusermessagesService));                  

export default usercontroller;                                         