// useEffect dependency array with dependencies - will run if dependency changes (state)
  // searchTerms will cause a change
  //We added search by breed by adding the paramiter to the subset
  // useEffect(() => {
  //   // searchTerm !== "" ? searchPost(searchTerm) : getAllPosts()
  //   if (searchTerm !== "") {
  //     // If the search field is not blank, display matching animals
      
  //     searchPosts(searchTerm)
  //     setFiltered(posts)
  //   } else {
  //     // If the search field is blank, display all posts
  //     setFiltered(posts)
  //   }
  // }, [searchTerm, posts])


  //turn current user into an object
  const currentUser = JSON.parse(localStorage.getItem("gifterUser"));

  //get current user id
  const currentUserId = currentUser.id