import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../providers/PostProvider";
import Post from "./Post";
import "bootstrap/dist/css/bootstrap.min.css"



export const PostForm = () => {
  const {addPost} = useContext(PostContext)
  
  //turn current user into an object
  const currentUser = JSON.parse(localStorage.getItem("gifterUser"));

  //get current user id
  const currentUserId = currentUser.id


  const [post, setPost] = useState({
    userProfileId: currentUserId,
    title: "",
    imageUrl: "",
    caption: ""
  })

  // Use this hook to allow us to programatically redirect users
  const navigate = useNavigate();

  //when a field changes, update state. The return will re-render and display based on the values in state
  
  //Controlled component
  const handleControlledInputChange = (event) => {
    /* When changing a state object or array,
      always create a copy, make changes, and then set state.*/
      const newPost = { ...post }
      /* Post is an object with properties.
      Set the property to the new value
      using object bracket notation. */

      //You can target id, or name. 
      newPost[event.target.id] = event.target.value
      // update state
      setPost(newPost)
  }

  const handleSavePost = (event) => {
    //Prevents the browser from submitting the form
    event.preventDefault() 

    //addPost
    addPost(post).then(() => navigate(`/`))

    //to clear form
    // post.title = ""
    // post.caption = ""
    // post.imageUrl = ""
  }

    return (
      <>
        <form className="postForm">
        <h2 className="postFormTitle"> New Post</h2>
        <fieldset>
          <div className="form-group">
            <label htmlFor="title">Title: </label>
            <input type="text" id="title" name="title" value={Post.title} required autoFocus 
            placeholder="Title"
            onChange={handleControlledInputChange}
            
            />
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL: </label>
            <input type="text" id="imageUrl" name="imageUrl" value={Post.imageUrl} required
            onChange={handleControlledInputChange}
            
            placeholder="Image URL"            
            
            />
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label htmlFor="caption">Caption: </label>
            <textarea rows="2" type="text" id="caption" name="caption" value={Post.caption}  
            placeholder="(Optional)"
            onChange={handleControlledInputChange}
            
            />
          </div>
          <div>
          
        </div>
        </fieldset>


        
        <button className="saveButton btn btn-primary"
          onClick= {handleSavePost}>

        <>Save Post</></button>

        <button className="btn btn-primary" onClick={() => {
        navigate(`/`)}}>Cancel</button>
        
      </form>
        
    </>
    )    

}