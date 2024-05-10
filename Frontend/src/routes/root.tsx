import Navbar from "@/components/navbar";
import { UserProvider, useAuth } from "@/context/useAuth";
import { createContext, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

// export const UserContext = createContext<User>(null);

// type User = {
//   roles: string[];
//   token: string;
// } | null;

const Root = () => {
  const { user } = useAuth();

  return (
    <UserProvider>
      <Navbar />
      <Outlet />
    </UserProvider>
  );
};

export default Root;
