import type { IUser, IUserMin, IPost, IPostWithUser, IReply, IUserWithPassword, IPostWithReplies, IReplyWithUser } from "../interfaces";
import * as fs from "fs";
import * as path from "path";

// Load JSON files dynamically to work in both dev and production
// In production, data files are in the same directory as index.js (built/data/)
// In dev, they are in src/data/
const getDataDir = () => {
    // Check if we're in production (data folder next to cwd)
    const prodPath = path.join(process.cwd(), 'data');
    if (fs.existsSync(path.join(prodPath, 'posts.json'))) {
        return prodPath;
    }
    
    // Check if we're in development
    const devPath = path.join(process.cwd(), 'src', 'data');
    if (fs.existsSync(path.join(devPath, 'posts.json'))) {
        return devPath;
    }
    
    throw new Error('Cannot find data directory. Make sure posts.json exists in either ./data/ or ./src/data/');
};

const dataDir = getDataDir();
const postsJson = JSON.parse(fs.readFileSync(path.join(dataDir, 'posts.json'), 'utf-8'));
const usersJson = JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf-8'));

// Convert Picsum URLs to local proxy URLs
function convertPicsumUrl(imageUrl: string | undefined): string | undefined {
    if (!imageUrl) return imageUrl;

    const picsumRegex = /https:\/\/picsum\.photos\/id\/(\d+)\/(\d+)\/(\d+)/;
    const match = imageUrl.match(picsumRegex);

    if (match) {
        const [, id, width, height] = match;
        return `/proxy/picsum/${id}/${width}/${height}`;
    }

    return imageUrl;
}

const allPostsData = postsJson.map((post) => ({
    ...post,
    publishDate: new Date(post.publishDate),
    imageUrl: convertPicsumUrl(post.imageUrl)
}));

let postsList: IPost[] = allPostsData
    .filter((post) => !post.parentPostId)
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

let repliesList: IReply[] = allPostsData
    .filter((post) => post.parentPostId)
    .map((reply) => ({
        ...reply,
        parentPostId: reply.parentPostId
    }));

let usersList: IUserWithPassword[] = usersJson.map((user) => ({
    ...user,
    registrationDate: new Date(user.registrationDate)
}));

function getUsersWithoutPassword(): IUser[] {
    return usersList.map((user: IUserWithPassword) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
}

function getUsersMinimal(): IUserMin[] {
    return usersList.map((user: IUserWithPassword) => {
        const userMin: IUserMin = {
            id: user.id,
            username: user.username,
            name: user.name,
            surname: user.surname,
            profileImg: user.profileImg
        }
        return userMin;
    });
}

function getTotalPosts(): number {
    return postsList.length;
}

function mapPostWithUser(parentPostId: string) {
    const post = postsList.find((post: IPost) => post.id === parentPostId);
    const user = usersList.find((user: IUser) => user.id === post.userId);
    return {
        ...post,
        nReplies: getRepliesByPost(post.id)?.length || 0,
        user
    }
}

function getPosts(limit: number, offset: number): IPostWithUser[] {
    const posts: IPost[] = postsList.slice(offset, offset + limit);
    const postsFull: IPostWithUser[] = posts.map((post: IPost) => {
        return mapPostWithUser(post.id);
    });
    return postsFull;
}

function getPost(parentPostId: string): IPost {
    return postsList.find((post: IPost) => post.id === parentPostId);
}

function getPostWithReplies(parentPostId: string): IPostWithReplies {
    const post = mapPostWithUser(parentPostId);
    const replies = getRepliesByPost(parentPostId);
    return {
        ...post,
        replies
    }
}

function getUserIdByUsername(username: string): string {
    return usersList.find((user: IUser) => user.username === username).id;
}

function getTotalPostsByUser(username: string): number {
    const userId = getUserIdByUsername(username);
    return postsList.filter((post: IPost) => post.userId === userId).length;
}

function getPostsByUser(username: string, limit: number, offset: number): IPost[] {
    const userId = getUserIdByUsername(username);
    const postByUser = postsList.filter((post: IPost) => post.userId === userId).map((post: IPost) => {
        return {
            ...post,
            nReplies: getRepliesByPost(post.id)?.length || 0
        }
    });
    return postByUser.slice(offset, offset + limit);
}

function addPost(userId: string, content: string): IPost {
    if (!content) return;
    if (!userId) return;
    if (userId !== usersList.find((user: IUser) => user.id === userId).id) return;

    const allExistingIds = [...postsList.map(p => parseInt(p.id)), ...repliesList.map(r => parseInt(r.id))];
    const maxId = Math.max(...allExistingIds);

    const newPost: IPost = {
        id: (maxId + 1).toString(),
        userId,
        content,
        publishDate: new Date()
    }
    postsList.unshift(newPost);
    return newPost;
}

function editPost(parentPostId: string, content: string): void {
    const postIndex = postsList.findIndex((post: IPost) => post.id === parentPostId);
    postsList[postIndex].content = content;
    postsList[postIndex].editedDate = new Date();
}

function deletePost(parentPostId: string): void {
    postsList = postsList.filter((post: IPost) => post.id !== parentPostId);
    repliesList = repliesList.filter((reply: IReply) => reply.parentPostId !== parentPostId);
}

function getRepliesByPost(parentPostId: string): IReplyWithUser[] {
    return repliesList.filter((reply: IReply) => reply.parentPostId === parentPostId).map((reply: IReply) => {
        const user: IUserMin = getUsersMinimal().find((user: IUserMin) => user.id === reply.userId);
        return {
            ...reply,
            nReplies: 0,
            nLikes: reply.nLikes || 0,
            user
        };
    });
}

function addReply(parentPostId: string, userId: string, content: string): void {
    if (!content) return;
    if (!userId) return;
    if (!parentPostId) return;

    const allExistingIds = [...postsList.map(p => parseInt(p.id)), ...repliesList.map(r => parseInt(r.id))];
    const maxId = Math.max(...allExistingIds);

    const newReply: IReply = {
        id: (maxId + 1).toString(),
        parentPostId,
        userId,
        content,
        publishDate: new Date()
    }
    repliesList.push(newReply);
}

function getUserByUsername(userName: string): IUser {
    const user = getUsersWithoutPassword().find((user: IUser) => user.username === userName);
    if (!user) return null;
    return user;
}

function checkPassword(userName: string, password: string): boolean {
    const user: IUserWithPassword = usersList?.find((user: IUserWithPassword) => user.username === userName);
    if (!user) return false;
    if (user.password !== password) return false;
    return true;
}

function addImageToPost(postId: string, filename: string): boolean {
    const postIndex = postsList.findIndex((post: IPost) => post.id === postId);
    if (postIndex === -1) return false;

    postsList[postIndex].imageUrl = `/uploads/posts/${filename}`;
    return true;
}

function removeImageFromPost(postId: string): boolean {
    const postIndex = postsList.findIndex((post: IPost) => post.id === postId);
    if (postIndex === -1) return false;

    postsList[postIndex].imageUrl = undefined;
    return true;
}


export {
    getPosts,
    getTotalPosts,
    getTotalPostsByUser,
    getPostsByUser,
    getPost,
    getPostWithReplies,
    checkPassword,
    getRepliesByPost,
    addPost,
    editPost,
    deletePost,
    getUserByUsername,
    addReply,
    addImageToPost,
    removeImageFromPost,
}