export interface User {
    id: string;
    name: string;
    postCount?: number;
  }
  
  export interface Post {
    id: number;
    userId: number | string;
    content: string;
    commentCount?: number;
    timestamp?: number;
  }
  
  export interface Comment {
    id: number;
    postId: number;
    content: string;
  }