import React from "react";
import { Routes, Route } from "react-router-dom";
import PostList from "./PostList";
import {PostForm} from "./PostForm";
import PostDetails from "./PostDetails";
import UserPosts from "./UserPosts";
import { PostProvider } from "../providers/PostProvider";
import UserProfile from "./UserPosts";
import { UserProvider } from "../providers/UserProvider";

export const ApplicationViews = () => {
  return (
    <UserProvider>
    <PostProvider>
    <Routes>
      
        <Route path="/" exact element={<PostList />} />
          
        <Route path="/posts/add" element={<PostForm />} />

        <Route path="/posts/:id" element={<PostDetails/>} />

        <Route path="/users/:id" element={<UserPosts />} />
      
    </Routes>
    </PostProvider>
    </UserProvider>
  );
};

