import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="">
      <div className="text-foreground sticky top-0 z-20 backdrop-blur-lg bg-background">
        <nav className="w-9/12 m-auto py-2 flex justify-between">
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
