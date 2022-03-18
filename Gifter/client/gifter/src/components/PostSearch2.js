import React, { useContext, useEffect, useState } from "react";
import { PostContext } from "../providers/PostProvider";


function PostSearch2() {
    const [searchTerm, setSearchTerm] = useState("")
    const {  searchPosts } = useContext(PostContext);
    const handleSearch = () => {
        console.log("ya clicked the search button", searchTerm)
        searchPosts(searchTerm)
    }
    return (<>
        <input type="text" id="search" placeholder="Enter your search phrase here..." onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
    </>)
}
export default PostSearch2;