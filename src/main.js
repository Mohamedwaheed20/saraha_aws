//bootsrap function

import express from "express";
import {config} from "dotenv";
config();
import connectDB from "./db/connection.js";
import routerHandler from "./utlites/controller-handeler.js";

const bootstrap=()=>{
    const app=express();
app.use(express.json());
connectDB();
routerHandler(app);
    app.listen(process.env.PORT ,()=>{
        console.log(`Example app is listening on port ${process.env.PORT}`);
    })
    
}


export default bootstrap;

