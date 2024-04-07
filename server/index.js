import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
        .then(()=>{console.log('MongoDB connected !!');})
        .catch(err=>{console.log(err)});

const app=express();

//allows json input in backend
app.use(express.json());

app.listen(3000,()=>{
    console.log("Server is running on port 3000 !!");
});


app.use('/api/user', userRoutes);
app.use('/api/auth',authRoutes);