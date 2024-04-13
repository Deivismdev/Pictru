import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="w-full h-full bg-background">
      <div className="text-foreground">
      <nav className="w-9/12 m-auto py-6 flex justify-between ">
        <h1 className="font-bold text-3xl">
          <Link to={"/"}> PICTRU</Link>
        </h1>
        <div className="flex gap-10">
          <Link to={"/gallery"}>Gallery</Link>
          <Link to={"/login"}>Log in</Link>
          <Link to={"/register"}>Sign up</Link>
        </div>
      </nav>

      </div>
      <Outlet />
    </div>
  );
}
