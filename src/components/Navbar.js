import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { currentUser } = useAuth();
  return (
    <nav className="navbar bg-light container">
      <h4>
        <Link className="link" to="/">
          <img src="logo3.png" width="80px" />
        </Link>
      </h4>
      <h4>
        <Link className="link" to="/sounds">
          Sounds
        </Link>
      </h4>
      <h4>
        {currentUser && (
          <Link className="link" to="/upload-sound">
            Upload
          </Link>
        )}
      </h4>
      <h4>
        {!currentUser && (
          <Link className="link" to="/login">
            Log In
          </Link>
        )}
      </h4>
    </nav>
  );
};

export default Navbar;
