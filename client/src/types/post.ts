
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
    author: {
        name: string;
        username: string;
        avatar: string;
        verified: boolean;
    };
    content: string;
    image?: string;
    location?: string | null;
    taggedUsers?: string[] | null;
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
    liked?: boolean;
    bookmarked?: boolean;
    isAd?: boolean;
    adUrl?: string | null;
    adCta?: string | null;
    poll?: {
        question: string;
        options: string[];
    };
}

export type CreatePost = {
    id: string;
    author: {
        name: string;
        username: string;
        avatar: string;
        verified: boolean;
    };
    content: string;
    image?: string;
    location?: string | null;
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
    poll?: {
        question: string;
        options: string[];
    };
};
