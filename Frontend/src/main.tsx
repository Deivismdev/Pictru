import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import Root from "./routes/root";
import ErrorPage from "./routes/error-page";
import Login from "./routes/login";
import Register from "./routes/register";
import "./globals.css";
import Gallery from "./routes/gallery";
import ImagePage, { loader as imageLoader } from "./routes/ImagePage";
import UploadPage from "./routes/UploadPage";
import ProfilePage, { loader as profileLoader } from "./routes/ProfilePage";
import ProtectedRoute from "./routes/protectedRoute";
import SuspendedImagePage from "./routes/SuspendedImagesPage";
import AdminRoute from "./routes/adminRoute";
import SuspendedImage, {
  loader as suspendedLoader,
} from "./routes/suspendedImage";
import LandingPage from "./routes/landingPage";
import SuspendedImagesPage from "./routes/SuspendedImagesPage";
import AllSuspendedImagesPage from "./routes/AllSuspendedImagesPage";
import EditImage, { loader as editLoader } from "./routes/editImage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/gallery/image/:imageId",
        element: <ImagePage />,
        loader: imageLoader,
      },
      {
        path: "/upload",
        element: (
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/:profileId",
        element: <ProfilePage />,
        loader: profileLoader,
      },

      {
        path: "/suspendedmy",
        element: (
          <ProtectedRoute>
            <SuspendedImagesPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/suspendedall",
        element: (
          <ProtectedRoute>
            <AllSuspendedImagesPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/appealed",
        element: (
          <ProtectedRoute>
            <AllSuspendedImagesPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/suspended/:imageId",
        element: <SuspendedImage />,
        loader: suspendedLoader,
      },
      {
        path: "/editImage/:imageId",
        element: <EditImage />,
        loader: editLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
