// src/types/post.ts
export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
}

export interface Post {
    id: string;
    author: User;
    content: string;
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
    image?: string;
    isAd?: boolean;
    adUrl?: string;
    adCta?: string;
}