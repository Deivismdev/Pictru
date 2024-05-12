import Navbar from "@/components/navbar";
import { UserProvider, useAuth } from "@/context/useAuth";
import { Outlet } from "react-router-dom";

// export const UserContext = createContext<User>(null);

// type User = {
//   roles: string[];
//   token: string;
// } | null;

const Root = () => {

  return (
    <UserProvider>
      <Navbar />
      <Outlet />
    </UserProvider>
  );
};

export default Root;
