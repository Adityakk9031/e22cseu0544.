export interface User {
  id: string;
  username: string;
  avatar: string;
  postCount: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  image: string;
  commentCount: number;
  timestamp: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
} 