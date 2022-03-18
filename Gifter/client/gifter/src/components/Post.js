import React from "react";
import { Card, CardImg, CardBody } from "reactstrap";
import Comment from "./Comment";
import { Link } from "react-router-dom";

const Post = ({ postProp }) => {
  
  return (
    <>
    
    <Card className="m-4">
    
      <p className="text-left px-2">
        <Link to={`/users/${postProp.userProfileId}`}>
        Posted by: {postProp.userProfile.name}
        </Link>  
      </p>
      
      <CardImg top src={postProp.imageUrl} alt={postProp.title} />
      <CardBody>
        <p>
          <Link to={`/posts/${postProp.id}`}>
            <strong>{postProp.title}</strong>
          </Link>
        </p>
        {postProp.caption ? <p>Caption: {postProp.caption}</p> : ""}
        
        {postProp.comments.id ? <p>Comments:</p> : ""}
        
        <ul>
        {postProp.comments.map(pc =>
          
          <li > {pc.userProfile.name}: {pc.message}  </li>)}
        </ul>
      </CardBody>
      
    </Card>
    </>
  );
};

export default Post;