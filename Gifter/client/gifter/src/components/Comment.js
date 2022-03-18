import React from "react";
import { Card, CardImg, CardBody } from "reactstrap";

const Comment = ({ commentProp }) => {
  return (
    <Card className="m-4">
      <p className="text-left px-2">Posted by: {commentProp.userProfile.name}</p>
      
      <CardBody>
        <p>
          <strong>{commentProp.userProfile.name}</strong>
        </p>
        <p>{commentProp.message}</p>
        
      </CardBody>
      
    </Card>
  );
};

export default Comment;