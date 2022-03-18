import React, { useContext } from "react"
import { PostContext } from "../providers/PostProvider";


export const PostSearch = () => {
    //Put data in state
    const {searchTerm, setSearchTerm, searchPost } = useContext(PostContext);
    
    
    return (
      <>
        Search Posts:
        <form onChange={(e) => e.preventDefault}>
        <input
        type="text"
        className="searchText"
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search for a post"
        />
        </form>
      </>
    );
  };
  
  

  //onKeyUp could be onChange