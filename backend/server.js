import express from 'express';
import dotenv from 'dotenv';
import {v2 as cloudinary} from  'cloudinary';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postsRoutes from './routes/post.route.js';

import connectMongoDB from './db/connectMongoDB.js'

dotenv.config();
cloudinary.config({
    cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET,
});


const app =express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));  //parse req.body//to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postsRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});


//link: https://www.youtube.com/watch?v=MDZC8VDZnV8&t=17s
//timestamp: 4:47:26