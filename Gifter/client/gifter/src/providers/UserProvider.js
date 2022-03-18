import React, { useState } from "react";

export const UserContext = React.createContext();

export const UserProvider = (props) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const getCurrentUser = () => {
    const currentUser = localStorage.getItem("gifterUser");

    return currentUser;
  };
  


  const login = (userObject) => {
    
    fetch(`https://localhost:44315/api/userprofile/getbyemail/${userObject.email}`)
      .then((r) => r.json())
      .then((userObjFromDB) => {

        localStorage.setItem("gifterUser", JSON.stringify(userObjFromDB));
        setIsLoggedIn(true);
      })
  };

  const register = (userObject) => {
    fetch("https://localhost:44315/api/userprofile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObject),
    })
      .then((response) => response.json())
      .then((userObject) => {
        localStorage.setItem("gifterUser", JSON.stringify(userObject));
        setIsLoggedIn(true);
      });
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{ getCurrentUser, login, register, logout, isLoggedIn }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
