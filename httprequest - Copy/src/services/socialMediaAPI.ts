import { User, Post, Comment } from '../types/socialMedia';

const BASE_URL = 'http://localhost:3000/api';

// Mock data for testing
const MOCK_USERS: { users: Record<string, string> } = {
  "users": {
    "1": "John Doe",
    "2": "Jane Doe",
    "3": "Alice Smith",
    "4": "Bob Johnson",
    "5": "Charlie Brown",
    "10": "Helen Moore",
    "11": "Ivy Taylor",
    "12": "Jack Anderson",
    "13": "Kathy Thomas",
    "14": "Liam Jackson",
    "15": "Mona Harris",
    "16": "Nathan Clark",
    "17": "Olivia Lewis",
    "18": "Paul Walker",
    "19": "Quinn Scott",
    "20": "Rachel Young"
  }
};

interface MockPost {
  id: number;
  userid: number;
  content: string;
}

const MOCK_POSTS: Record<string, MockPost[]> = {
  "1": [
    {
      "id": 246,
      "userid": 1,
      "content": "Post about ant"
    },
    {
      "id": 161,
      "userid": 1,
      "content": "Post about elephant"
    },
    {
      "id": 150,
      "userid": 1,
      "content": "Post about dinosaurs"
    }
  ],
  "2": [
    {
      "id": 247,
      "userid": 2,
      "content": "My first day at work"
    },
    {
      "id": 248,
      "userid": 2,
      "content": "The sunset was beautiful today"
    }
  ],
  "3": [
    {
      "id": 249,
      "userid": 3,
      "content": "My favorite recipe"
    }
  ]
};

interface MockComment {
  id: number;
  postid: number;
  content: string;
}

const MOCK_COMMENTS: Record<string, MockComment[]> = {
  "246": [
    {
      "id": 1001,
      "postid": 246,
      "content": "Great observation about ants!"
    },
    {
      "id": 1002,
      "postid": 246,
      "content": "I disagree, ants are not that interesting."
    }
  ],
  "161": [
    {
      "id": 1003,
      "postid": 161,
      "content": "Elephants are magnificent creatures!"
    }
  ],
  "247": [
    {
      "id": 1004,
      "postid": 247,
      "content": "How was it?"
    },
    {
      "id": 1005,
      "postid": 247,
      "content": "Congratulations on your new job!"
    }
  ]
};

// Flag to switch between real API and mock data
const USE_MOCK_DATA = true;

/**
 * Fetches data from the social media platform API
 * Cache results to reduce API calls and costs
 */
export class SocialMediaAPI {
  private usersCache: User[] = [];
  private postsCache: Map<string, Post[]> = new Map();
  private commentsCache: Map<string, Comment[]> = new Map();
  private lastFetchTimes: Map<string, number> = new Map();
  
  // Cache expiration in milliseconds (5 minutes)
  private CACHE_EXPIRATION = 5 * 60 * 1000;
  
  private async fetchWithCache<T>(
    url: string, 
    cacheKey: string, 
    cacheMap: Map<string, T>,
    transform: (data: any) => T
  ): Promise<T> {
    const now = Date.now();
    const lastFetchTime = this.lastFetchTimes.get(cacheKey) || 0;
    
    // Use cache if it's not expired
    if (
      cacheMap.has(cacheKey) && 
      now - lastFetchTime < this.CACHE_EXPIRATION
    ) {
      console.log(`Using cached data for ${cacheKey}`);
      return cacheMap.get(cacheKey) as T;
    }
    
    try {
      console.log(`Fetching fresh data for ${url}`);
      
      let data;
      if (USE_MOCK_DATA) {
        // Use mock data based on URL pattern
        if (url.includes('/users') && !url.includes('/posts')) {
          data = MOCK_USERS;
        } else if (url.includes('/posts') && url.includes('/comments')) {
          const postId = url.split('/posts/')[1].split('/comments')[0];
          data = { comments: MOCK_COMMENTS[postId] || [] };
        } else if (url.includes('/users/') && url.includes('/posts')) {
          const userId = url.split('/users/')[1].split('/posts')[0];
          data = { posts: MOCK_POSTS[userId] || [] };
        }
      } else {
        // Use real API
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        data = await response.json();
      }
      
      const transformedData = transform(data);
      
      // Update cache
      cacheMap.set(cacheKey, transformedData);
      this.lastFetchTimes.set(cacheKey, now);
      
      return transformedData;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      
      // Return cached data if available, even if expired
      if (cacheMap.has(cacheKey)) {
        console.log(`Returning stale cached data for ${cacheKey}`);
        return cacheMap.get(cacheKey) as T;
      }
      
      throw error;
    }
  }
  
  async getUsers(): Promise<User[]> {
    const url = `${BASE_URL}/users`;
    const cacheKey = 'all_users';
    
    if (USE_MOCK_DATA) {
      console.log('Using mock users data');
      const users: User[] = [];
      for (const [id, name] of Object.entries(MOCK_USERS.users)) {
        users.push({ id, name: name as string });
      }
      return users;
    }
    
    if (this.usersCache.length > 0) {
      const now = Date.now();
      const lastFetchTime = this.lastFetchTimes.get(cacheKey) || 0;
      
      if (now - lastFetchTime < this.CACHE_EXPIRATION) {
        console.log(`Using cached users data`);
        return this.usersCache;
      }
    }
    
    try {
      console.log(`Fetching fresh users data`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      const users: User[] = [];
      
      for (const [id, name] of Object.entries(data.users)) {
        users.push({ id, name: name as string });
      }
      
      // Update cache
      this.usersCache = users;
      this.lastFetchTimes.set(cacheKey, Date.now());
      
      return users;
    } catch (error) {
      console.error(`Error fetching users:`, error);
      
      // Return cached data if available, even if expired
      if (this.usersCache.length > 0) {
        console.log(`Returning stale cached users data`);
        return this.usersCache;
      }
      
      throw error;
    }
  }
  
  async getUserPosts(userId: string): Promise<Post[]> {
    const url = `${BASE_URL}/users/${userId}/posts`;
    const cacheKey = `user_posts_${userId}`;
    
    if (USE_MOCK_DATA) {
      console.log(`Using mock posts data for user ${userId}`);
      const posts = MOCK_POSTS[userId] || [];
      return posts.map(post => ({
        id: post.id,
        userId: post.userid,
        content: post.content
      }));
    }
    
    return this.fetchWithCache<Post[]>(
      url,
      cacheKey,
      this.postsCache,
      (data) => {
        return data.posts.map((post: any) => ({
          id: post.id,
          userId: post.userid,
          content: post.content
        }));
      }
    );
  }
  
  async getPostComments(postId: number): Promise<Comment[]> {
    const url = `${BASE_URL}/posts/${postId}/comments`;
    const cacheKey = `post_comments_${postId}`;
    
    if (USE_MOCK_DATA) {
      console.log(`Using mock comments data for post ${postId}`);
      const postIdStr = postId.toString();
      const comments = MOCK_COMMENTS[postIdStr] || [];
      return comments.map(comment => ({
        id: comment.id,
        postId: comment.postid,
        content: comment.content
      }));
    }
    
    return this.fetchWithCache<Comment[]>(
      url,
      cacheKey,
      this.commentsCache,
      (data) => {
        return data.comments.map((comment: any) => ({
          id: comment.id,
          postId: comment.postid,
          content: comment.content
        }));
      }
    );
  }
  
  async getAllPosts(): Promise<Post[]> {
    if (USE_MOCK_DATA) {
      console.log('Using all mock posts data');
      const allPosts: Post[] = [];
      
      for (const userId in MOCK_POSTS) {
        MOCK_POSTS[userId].forEach(post => {
          allPosts.push({
            id: post.id,
            userId: post.userid,
            content: post.content
          });
        });
      }
      
      return allPosts;
    }
    
    // Get all users first
    const users = await this.getUsers();
    
    // Fetch posts for each user in parallel
    const postsPromises = users.map(user => this.getUserPosts(user.id));
    const postsArrays = await Promise.all(postsPromises);
    
    // Flatten the arrays of posts
    return postsArrays.flat();
  }
}

// Create and export a singleton instance
export const socialMediaAPI = new SocialMediaAPI();
