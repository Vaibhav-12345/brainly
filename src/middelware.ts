import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";


export const userMiddelware=(req:Request,res:Response,next:NextFunction)=>{
    // const header=req.headers.id;
    const header=req.headers["token"];
    // const token=req.headers.id;
    const decode= jwt.verify(header as string , JWT_SECRET)

    if(decode){
        // either change or ignore this and override the types of the express request object
        // @ts-ignore 
        req.userId=decode.id
        next()
    }
    else{
        res.status(403).json({
            message:'You are not login plz login'
        })
    }

}