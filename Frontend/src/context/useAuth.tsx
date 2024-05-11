import { createContext, useEffect, useState } from "react";
// import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
// import { loginAPI, registerAPI } from "../Services/AuthService";
import React from "react";

export type UserProfile = {
  userId: string;
  userName: string;
  //   email: string;
  roles: string[]; // enum?
};

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  loginUser: (data: { UserName: string; Password: string }) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles");

    console.warn(username, userId, token, roles);

    if (token && username && roles && userId) {
      setUser({ userName: username, userId: userId, roles: JSON.parse(roles) });
      setToken(token);
    }
    setIsReady(true);
  }, []);

  const isLoggedIn = () => {
    return !!user;
  };

  const loginUser = async (data: any) => {
    const response = await fetch(`http://localhost:5095/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    // console.log(response);
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      localStorage.setItem("roles", JSON.stringify(result.roles));
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userName", result.userName);

      setUser({
        userName: result.username,
        userId: result.userId,
        roles: result.roles,
      });
      setToken(result.token);

      console.log("Login successful:", result);

      navigate("/gallery");
    } else {
      console.log(response.body);
    }

    // const token = localStorage.getItem("token");
    // console.log(token);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ user, token, logout, loginUser, isLoggedIn }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
