import React, { useEffect, useContext, useState } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { PostContext } from "../providers/PostProvider";
import { useParams } from "react-router-dom";
import Post from "./Post";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState();
  const { getUserPosts } = useContext(PostContext);
  //hook used to access the route param
  const { id } = useParams();

  useEffect(() => {
    getUserPosts(id).then(setUserProfile);
  }, []);

  if (!userProfile) {
    return null;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-sm-12 col-lg-6">
            <ListGroup>
            {userProfile.posts.map((p) => (
              <Post key={p.id} postProp={p} />
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;