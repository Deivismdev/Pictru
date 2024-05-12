import Navbar from "@/components/navbar";
import { UserProvider, useAuth } from "@/context/useAuth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// export const UserContext = createContext<User>(null);

// type User = {
//   roles: string[];
//   token: string;
// } | null;

const Root = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <UserProvider>
      <Navbar />
      <Outlet />
    </UserProvider>
  );
};

export default Root;
