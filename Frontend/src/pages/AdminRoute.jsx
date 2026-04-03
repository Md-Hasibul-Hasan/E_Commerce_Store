import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);

  if (!user?.is_staff) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;