import express from 'express';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js'
import cookieParser from 'cookie-parser';

dotenv.config();
const app =express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));  //parse req.body//to parse form data(urlencoded)
app.use(cookieParser());
app.use("/api/auth",authRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});


//link: https://www.youtube.com/watch?v=MDZC8VDZnV8&t=17s
//timestamp: 2:43:31