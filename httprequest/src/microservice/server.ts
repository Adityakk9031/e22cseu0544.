import express from 'express';
import cors from 'cors';
import { socialMediaAPI } from '../services/socialMediaAPI';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Social Media API Microservice is running' });
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await socialMediaAPI.getUsers();
    console.log(`Successfully retrieved ${users.length} users`);
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get posts for a specific user
app.get('/api/users/:userId/posts', async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await socialMediaAPI.getUserPosts(userId);
    console.log(`Successfully retrieved ${posts.length} posts for user ${userId}`);
    res.json({ posts });
  } catch (error) {
    console.error(`Error fetching posts for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get comments for a specific post
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await socialMediaAPI.getPostComments(Number(postId));
    console.log(`Successfully retrieved ${comments.length} comments for post ${postId}`);
    res.json({ comments });
  } catch (error) {
    console.error(`Error fetching comments for post ${req.params.postId}:`, error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get all posts from all users
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await socialMediaAPI.getAllPosts();
    console.log(`Successfully retrieved ${posts.length} posts in total`);
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

export default app;