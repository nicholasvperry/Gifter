import React, {useContext} from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import { UserContext } from "../providers/UserProvider";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate()
  
  const {logout} = useContext(UserContext)
  
  const handleLogout = () => { 
    logout()
    //reload page
    window.location.reload(false)
  }

  return (
    <>
    <nav className="navbar navbar-expand navbar-dark bg-info">
      <Link to="/" className="navbar-brand">
        GiFTER
      </Link>
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/posts/add" className="nav-link">
            New Post
          </Link>
        </li>
        <li className="nav-item">
          
          <button className="button logoutButton" onClick={handleLogout}>Logout</button>
          
        </li>
      </ul>
    </nav>
    </>
  );
};

export default Header;