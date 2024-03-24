import { Outlet, Navigate } from "react-router-dom";
import { Navbar } from "@/components/ui/guest-navbar";
const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <div className="flex flex-row">
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/dangerfloof.jpg"
            alt="logo"
            className="hidden lg:block h-90v w-1/2 object-cover bg-no-repeat"
          />
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
