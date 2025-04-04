import { User, Post, Comment } from '../types';

// Generate random users
const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    username: `User${i + 1}`,
    avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
    postCount: Math.floor(Math.random() * 100) + 1
  }));
};

// Generate random posts
const generatePosts = (count: number, users: User[]): Post[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    userId: users[Math.floor(Math.random() * users.length)].id,
    username: users[Math.floor(Math.random() * users.length)].username,
    content: `This is post ${i + 1} content`,
    image: `https://picsum.photos/seed/${i + 1}/800/600`,
    commentCount: Math.floor(Math.random() * 50),
    timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  }));
};

// Generate random comments
const generateComments = (count: number, posts: Post[], users: User[]): Comment[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `comment-${i + 1}`,
    postId: posts[Math.floor(Math.random() * posts.length)].id,
    userId: users[Math.floor(Math.random() * users.length)].id,
    username: users[Math.floor(Math.random() * users.length)].username,
    content: `This is comment ${i + 1}`,
    timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  }));
};

// Generate initial data
const users = generateUsers(10);
const posts = generatePosts(20, users);
const comments = generateComments(50, posts, users);

// Mock API functions
export const mockApi = {
  getTopUsers: async (): Promise<User[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Sort users by post count and return top 5
    return [...users]
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);
  },

  getTrendingPosts: async (): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Find posts with maximum comment count
    const maxComments = Math.max(...posts.map(p => p.commentCount));
    return posts.filter(post => post.commentCount === maxComments);
  },

  getPosts: async (): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return posts sorted by timestamp (newest first)
    return [...posts].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return comments.filter(comment => comment.postId === postId);
  }
};

export default mockApi; 