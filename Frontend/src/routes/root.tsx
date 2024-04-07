import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="w-screen h-screen bg-background">
      <nav className="text-foreground flex justify-between px-12 py-6">
        <h1 className="font-bold text-3xl">
          <Link to={"/"}> PICTRU</Link>
        </h1>
        <div className="flex gap-10">
          <Link to={"/gallery"}>Gallery</Link>
          <Link to={"/login"}>Log in</Link>
          <Link to={"/register"}>Sign up</Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
