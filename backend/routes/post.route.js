import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createPost, likeUnlikePost } from '../controllers/post.controller.js';
import { deletePost } from '../controllers/post.controller.js';
import { commentOnPost } from '../controllers/post.controller.js';
import { getAllPosts } from '../controllers/post.controller.js';
import { getLikedPosts } from '../controllers/post.controller.js';
import { getFollowingPosts } from '../controllers/post.controller.js';
import { getUserPosts } from '../controllers/post.controller.js';
const router =express.Router();

router.get('/all',protectRoute,getAllPosts);
router.get('/following',protectRoute,getFollowingPosts);
router.get('/likes/:id',protectRoute,getLikedPosts); //to get the liked post, that the use liked.
router.get('/user/:username',protectRoute,getUserPosts); 
router.post('/create',protectRoute,createPost);
router.post('/like/:id',protectRoute,likeUnlikePost) //like or unlike the post.
router.post('/comment/:id',protectRoute,commentOnPost);
router.delete('/:id',protectRoute,deletePost)
 export default router;

