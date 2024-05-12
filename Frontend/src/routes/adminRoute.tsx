import { useAuth } from "@/context/useAuth";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type Props = { children: React.ReactNode };

const AdminRoute = ({ children }: Props) => {
  const { isLoggedIn, user } = useAuth();

  if (isLoggedIn() && user?.roles.includes("Moderator")) {
    return <>{children}</>;
  } else {
    <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
