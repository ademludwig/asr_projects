import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  if (user.is_admin !== 1) return <Navigate to="/vote" replace />;

  return children;
}
