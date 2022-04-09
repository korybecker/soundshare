import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // show children only if user is logged in
  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
