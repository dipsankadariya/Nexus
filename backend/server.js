import express from 'express';
import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

import connectMongoDB from './db/connectMongoDB.js'

dotenv.config();

const app =express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));  //parse req.body//to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});


//link: https://www.youtube.com/watch?v=MDZC8VDZnV8&t=17s
//timestamp: 3:25:47