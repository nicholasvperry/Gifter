import React, { useState } from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import {ApplicationViews} from "./components/ApplicationViews";
import { PostProvider } from "./providers/PostProvider";
import Header from "./components/Header";
import PostSearch2 from "./components/PostSearch2";
import { Login } from "./components/Login";
import { UserProvider } from "./providers/UserProvider";
import { Register } from "./components/Register";

function App() {

  // eslint-disable-next-line
  const [loggedin, setLoggedin] = useState(false);

  const changeState = (bool) => setLoggedin(bool);

  if (localStorage.getItem("gifterUser")) {
  return (
    <div className="App">
      <Router>
        
        <UserProvider>
          <Header />
        </UserProvider>  
          <ApplicationViews />
        
      </Router>
    </div>
  );
} else {
  return (
    <Router>
      <UserProvider>
      <Login setLoggedin={changeState} />
      <Register setLoggedin={changeState} />
      </UserProvider>
    </Router>
  )
}
}

export default App;