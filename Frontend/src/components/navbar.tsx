import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  const renderNavbar = () => {
    let links;
    if (user?.roles.includes("Member") && !user?.roles.includes("Moderator")) {
      links = (
        <>
          <Link to={"/gallery"}>Gallery</Link>
          <Link to={`/user/${user.userId}`}>My account</Link>
          <Link to={"/register"}>My images</Link>
          <Link to={"/upload"}>Upload</Link>
          <button onClick={() => logout()}>Logout</button>
        </>
      );
    } else if (user?.roles.includes("Moderator")) {
      links = (
        <>
          <Link to={"/gallery"}>Admin</Link>
          <Link to={"/gallery"}>Gallery</Link>
          <Link to={"/login"}>My account</Link>
          <Link to={"/upload"}>Upload</Link>
          <Link to={"/register"}>My images</Link>
          <button onClick={() => logout()}>Logout</button>
        </>
      );
    } else {
      links = (
        <>
          <Link to={"/gallery"}>Gallery</Link>
          <Link to={"/login"}>Log in</Link>
          <Link to={"/register"}>Sign up</Link>
        </>
      );
    }
    return (
      <nav className="w-9/12 m-auto py-2 flex justify-between">
        <Link className="font-bold text-3xl" to={"/"}>
          {" "}
          PICTRU
        </Link>
        <div className="flex gap-10 items-center">
          {links}
          {user && <div>logged in as {user?.userName}</div>}
        </div>
      </nav>
    );
  };

  return (
    <div className="text-foreground sticky top-0 z-20 backdrop-blur-lg bg-background ">
      {renderNavbar()}
    </div>
  );
}
