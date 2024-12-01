import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Auth from "./layout/Auth";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Layout from "./layout/Layout";
import { ThemeProvider } from "./context/ThemeProvider";
import HomePage from "./pages/HomePage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./components/profile/EditProfile";
import ConnectionsPage from "./pages/ConnectionsPage";
import GetUserProfile from "./components/user/GetUserProfile";
import { ToastProvider } from "./context/ToastProvider";
import UnauthorizedPage from "./components/extra/Unauthorized";
import NotFoundPage from "./components/extra/NotFoundPage";
import Home from "./components/home/Home";
import PostPage from "./pages/PostPage";
import GetPost from "./components/post/GetPost";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/auth/login",
          element: (
            <PublicRoute>
              <Auth />
            </PublicRoute>
          ),
        },
        {
          path: "/auth/signup",
          element: (
            <PublicRoute>
              <Auth />
            </PublicRoute>
          ),
        },
        {
          path: "/",
          element: (
            <PublicRoute>
              <Home />
            </PublicRoute>
          ),
        },
        {
          path: "/home",
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/home/:userId",
          element: (
            <ProtectedRoute>
              <GetUserProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/posts",
          element: (
            <ProtectedRoute>
              <PostPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/posts/:postId",
          element: (
            <ProtectedRoute>
              <GetPost />
            </ProtectedRoute>
          ),
        },
        {
          path: "/connections",
          element: (
            <ProtectedRoute>
              <ConnectionsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile/edit",
          element: (
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/settings",
          element: (
            <ProtectedRoute>
              <SettingPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/unauthorized",
          element: <UnauthorizedPage />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);
  return (
    <ToastProvider>
      <ThemeProvider defaultTheme="dark" storageKey="devconnect-ui-theme">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
