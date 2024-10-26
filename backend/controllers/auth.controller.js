import express from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/utilis/generateToken.js';

// Signup function to handle user registration
export const signup = async (req, res) => {
  try {
    // Destructuring the required fields from request body
    const { fullName, username, email, password } = req.body;

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // If email format is invalid, return a 400 status with error message
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if a user with the provided username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // If username is already taken, return a 400 status with error message
      return res.status(400).json({ error: "Username already taken, Please choose another one." });
    }

    // Check if a user with the provided email already exists in the database
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      // If email is already taken, return a 400 status with error message
      return res.status(400).json({ error: "Email already taken, Please choose another one." });
    }

    if(password.length <6){
        return res.status(400).json({error:"Password must be of 6 characters or more."})   }

    // Generate a salt for hashing the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with the provided information and the hashed password
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword
    });

    // Check if newUser object was created successfully
    if (newUser) {
      // Call the function to generate a token and set it as a cookie
      generateTokenAndSetCookie(newUser._id, res);

      // Save the new user instance to the database
      await newUser.save();

      // Send a 201 status response with newly created user's information
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      // If the user creation failed, return a 400 status with an error message
      res.status(400).json({ error: "Invalid user data" });
    }

  } catch (error) {
    // Log the error message in the console
    console.log("Error in signup controller", error.message);
    // Return a 500 status indicating an internal server error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login function to handle user login requests
export const login = async (req, res) => {
 try{
  const {username, password} = req.body;
  const user = await User.findOne ({username});
  const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")
  if(!user ||  !isPasswordCorrect){
    return res.status(400).json({error: "Invalid username or password"})
  }

  generateTokenAndSetCookie(user._id,res);

  res.status(200).json({
    _id: user._id,
    fullname: user.fullName,
    username: user.username,
    email: user.email,
    followers: user.followers,
    following: user.following,
    profileImg: user.profileImg,
    coverImg: user.coverImg,
  });

 }
 catch(error){
   // Log the error message in the console
   console.log("Error in login controller", error.message);
   // Return a 500 status indicating an internal server error
   res.status(500).json({ error: "Internal Server Error" });
 }
};

// Logout function to handle user logout requests
export const logout = async (req, res) => {
 try{
  res.cookie("jwt","",{maxAge:0})
  res.status(200).json({message:"Logged out successfully"})
 }
 catch(error){
  console.log("Error in loginout controller", error.message);
  // Return a 500 status indicating an internal server error
  res.status(500).json({ error: "Internal Server Error" });
 }
};


export const getMe = async (req,res)=>{
  try{
 const user= await User.findById(req.user._id).select("-password");
 res.status(200).json(user);
  }
  catch(error){
    console.log("Error in getme controller", error.message);
    // Return a 500 status indicating an internal server error
    res.status(500).json({ error: "Internal Server Error" });
  }
}