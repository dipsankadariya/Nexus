// Import the Express module for routing and handling HTTP requests
import express from 'express';

// Import the User model to access user data from the database
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';


// Controller function to get a user's profile information by username
export const getUserProfile = async (req, res) => {
    // Extract the 'username' parameter from the request's URL
    const { username } = req.params;

    try {
        // Find a user in the database by 'username', excluding the 'password' field
        const user = await User.findOne({ username }).select("-password");

        // If no user is found, respond with a 404 status and an error message
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If user is found, respond with user data and a 200 (OK) status
        res.status(200).json(user);
    } 
    catch (error) {
        // If an error occurs, respond with a 500 (Internal Server Error) status and error message
        res.status(500).json({ error: error.message });

        // Log the error message to the console for debugging
        console.log("Error in getUserProfile", error.message);
    }
};


// Controller function to handle follow/unfollow actions
export const followUnfollowUser = async (req, res) => {
   try {
       // Extract the 'id' parameter of the user to follow/unfollow
       const { id } = req.params;

       // Find the user to modify (followed/unfollowed user) by ID
       const userToModify = await User.findById(id);

       // Find the current user making the request by ID
       const currentUser = await User.findById(req.user._id);

       // Prevent the user from following/unfollowing themselves
       if (id === req.user._id.toString()) {
           return res.status(400).json({ error: "You can't follow or unfollow yourself" });
       }

       // If either user is not found, respond with a 400 status and error message
       if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

       // Check if the current user is already following the user to modify
       const isFollowing = currentUser.following.includes(id);

       // If the user is already following, proceed to unfollow
       if (isFollowing) { 
           // Remove the current user from the followers list of the userToModify
           await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

           // Remove the userToModify from the following list of the currentUser
           await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

           // Respond with a success message for unfollow action
           res.status(200).json({ message: "User unfollowed successfully" });
       } 
       else {
           // Follow the user to modify by adding currentUser to their followers list
           await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
    
           // Update the following list of currentUser after following the userToModify
           await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            // Create a new notification for the follow action
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });

            // Save the notification to the database
            await newNotification.save();
            
           // Respond with a success message for follow action
           res.status(200).json({ message: "User followed successfully" });
       }

       // Optional: send a notification for the follow/unfollow action
   }
   catch (error) {
       // If an error occurs, respond with a 500 status and error message
       res.status(500).json({ error: error.message });

       // Log the error message to the console for debugging
       console.log("Error in followUnfollow", error.message);
   }
}


// Controller function to get a list of suggested users for the current user to follow
export const getSuggestedUsers = async (req, res) => {
	try {
		// Get the current user's ID
		const userId = req.user._id;

		// Find users that the current user is already following, selecting only the 'following' field
		const usersFollowedByMe = await User.findById(userId).select("following");

		// Retrieve a random sample of 10 users from the database, excluding the current user
		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		// Filter out users that the current user is already following
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));

		// Limit the list to a maximum of 4 suggested users
		const suggestedUsers = filteredUsers.slice(0, 4);

		// Remove the password field from each suggested user's data before sending response
		suggestedUsers.forEach((user) => (user.password = null));

		// Respond with the list of suggested users
		res.status(200).json(suggestedUsers);
	} catch (error) {
		// Log the error message to the console for debugging
		console.log("Error in getSuggestedUsers: ", error.message);

		// If an error occurs, respond with a 500 status and error message
		res.status(500).json({ error: error.message });
	}
};
