import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import postRoutes from './routes/postRoute.js';
import commentRoutes from './routes/commentRoute.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
        .then(()=>{console.log('MongoDB connected !!');})
        .catch(err=>{console.log(err)});

const app=express();

//allows json input in backend
app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log("Server is running on port 3000 !!");
});


app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes);

//middlewares
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});