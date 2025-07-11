import { Router } from "express";
import * as messageservice from "./service/message-service.js";
import { authanticationMiddleware } from "../../middelware/authantication-middelware.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
const messagecontroller=Router()
messagecontroller.post("/sendmessage", errorHandler(messageservice.sendmessageService));
messagecontroller.get("/getmessage", errorHandler(messageservice.getmessageService));
export default messagecontroller
