import React, { useContext, useEffect, useState } from "react";
import { PostContext } from "../providers/PostProvider";
import Post from "./Post";
import {PostSearch} from "./PostSearch"

const PostList = () => {
  const [userProfile, setUserProfile] = useState();
  const { getUserPosts } = useContext(PostContext);
  //hook used to access the route param
  
  //turn current user into an object
  const currentUser = JSON.parse(localStorage.getItem("gifterUser"));

  //get current user id
  const currentUserId = currentUser.id

  useEffect(() => {
    getUserPosts(currentUserId).then(setUserProfile);
  }, []);

  if (!userProfile) {
    return null;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-sm-12 col-lg-6">
            <div>
            {userProfile.posts?.map((p) => (
              <Post key={p.id} postProp={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;