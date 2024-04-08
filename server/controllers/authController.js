import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async(req,res,next)=>{
    //console.log(req.body);
    const {username,email,password}=req.body;
    if(!username || !email || !password || username==='' || password==='' || email==='')
    {
        next(errorHandler(400,'All fields are required'));
    }

    const hashedPassword=bcryptjs.hashSync(password,10);

    const newUser=new User({
        username,
        email,
        password:hashedPassword
    });

    try{
        await newUser.save();
        res.json('Signup successfull!');
    }
    catch(err){
        next(err);
    }
}

export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password || email==='' || password==='')
    {
        next(errorHandler(400,'All fields are required'));
    }

    try{
        const validUser=await User.findOne({email});
        if(!validUser)
        return next(errorHandler(404,'User not found!'));
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword)
        return next(errorHandler(400,'Invalid password!'));

        const token=jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password:pass, ...rest}=validUser._doc;
        res.status(200)
           .cookie('access_token',token,{
            httpOnly:true,
           })
           .json(rest);
    }
    catch(err){
        next(err);
    }
}

export const google=async(req,res,next)=>{
    const {email,name,googlePhotoURL}=req.body;
    try{
        const user=await User.findOne({email});
        if(user)
        {
            const token=jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password, ...rest}=user._doc;
            res.status(200)
               .cookie('access_token',token,{
                httpOnly:true,
               })
               .json(rest);
        }
        else
        {
            const generatedPassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword=bcryptjs.hashSync(generatedPassword,10)+Math.random().toString(9).slice(-4);
            const newUser=new User({
                username:name.toLowerCase().split(' ').join(''),
                email,
                password:hashedPassword,
                profilePicture:googlePhotoURL
            });
            await newUser.save();
            const token=jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password, ...rest}=newUser._doc;
            res.status(200)
               .cookie('access_token',token,{
                httpOnly:true,
               })
               .json(rest);
        }
    }
    catch(err){
        next(err);
    }
}