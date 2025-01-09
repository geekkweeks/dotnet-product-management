import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { Spin } from "antd";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  // Check if the token is stored in localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    // If there is no token, redirect to the /login page
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // If there is a token, render the children
  if (token) {
    return <>{children}</>;
  }

  // Optionally, you can show a spinner or some loading state while checking the token
  return <Spin />;
}

export default ProtectedRoute;
