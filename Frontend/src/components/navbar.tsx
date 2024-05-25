import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  const renderNavbar = () => {
    let links;
    if (user?.roles.includes("Member") && !user?.roles.includes("Moderator")) {
      links = (
        <>
          <Link to={"/gallery"}>Gallery</Link>
          <Link to={"/suspendedmy"}>Suspended images</Link>
          <Link to={"/upload"}>Upload</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="font-semibold text-primary">
              {user.userName}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to={`/user/${user.userId}`}>My account</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={"/getpremium"} className="text-amber-500">
                  Become premium
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button className="text-red-700" onClick={() => logout()}>
                  Logout
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    } else if (user?.roles.includes("Moderator")) {
      links = (
        <>
          <Link to={"/suspendedmy"}>Suspended images</Link>
          <Link to={"/gallery"}>Gallery</Link>
          <Link to={"/upload"}>Upload</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="font-semibold text-primary">
              <span className="flex">Admin</span>{" "}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to={"/appealed"}>Appealed suspensions</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={"/suspendedall"}>Suspended (admin)</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="font-semibold text-primary">
              {user.userName}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to={`/user/${user.userId}`}>My account</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button className="text-red-700" onClick={() => logout()}>
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <Link className="font-bold text-3xl" to={"/home"}>
          {" "}
          PICTRU
        </Link>
        <div className="flex gap-10 items-center">{links}</div>
      </nav>
    );
  };

  return (
    <div className="text-foreground sticky top-0 z-20 backdrop-blur-lg bg-background ">
      {renderNavbar()}
    </div>
  );
}
