import React, { useState } from "react";

export const PostContext = React.createContext();

export const PostProvider = (props) => {
  //post state holds list of posts from API
  const [posts, setPosts] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("")


  const getAllPosts = () => {
    return fetch(`https://localhost:44315/api/post/getwithcomments`)
      .then((res) => res.json())
      .then(setPosts);
  };

  const addPost = (post) => {
    return fetch(`https://localhost:44315/api/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    }).then(getAllPosts)
  };

  const searchPosts = () => {
    return fetch(`https://localhost:44315/api/post/search?q=${searchTerm}`)
      .then((res) => res.json())
      .then(setPosts);
  };

  const getByIdWithComments = (id) => {
    return fetch(`https://localhost:44315/api/Post/GetPostByIdWithComments/${id}`).then((res) => res.json());
  };

  const getUserPosts = (id) => {
    return fetch(`https://localhost:44315/api/UserProfile/${id}`)
  .then((res) => res.json())
  
}


  return (
    <PostContext.Provider value={{ posts, getAllPosts, addPost, searchPosts, searchTerm, setSearchTerm, getByIdWithComments, getUserPosts }}>
      {props.children}
    </PostContext.Provider>
  );
};