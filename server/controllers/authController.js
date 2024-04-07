import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs';

export const signup = async(req,res)=>{
    //console.log(req.body);
    const {username,email,password}=req.body;
    if(!username || !email || !password || username==='' || password==='' || email==='')
    {
        return res.status(400).json({message:'All fields are requried'});
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
        res.status(500).json({message:err.message});
    }
}