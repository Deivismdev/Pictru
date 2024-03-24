import { Routes, Route } from "react-router-dom";
import "./globals.css";
// default imports
import LoginForm from "./_auth/forms/LoginForm";
import RegisterForm from "./_auth/forms/RegisterForm";

// name imports // wut difference?
import { Home } from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import Welcome from "./_root/pages/Welcome";

const App = () => {
  return (
    <div>
      <main className="flex h-screen container">
        <Routes>
          {/* public routes  */}
          <Route element={<AuthLayout />}>
            <Route path="welcome" element={<Welcome />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>
          {/* private routes  */}
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default App;
