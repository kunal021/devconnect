import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./layout/Auth";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./components/profile/EditProfile";
import ConnectionsPage from "./pages/ConnectionsPage";
import GetUserProfile from "./components/user/GetUserProfile";
import UnauthorizedPage from "./components/extra/Unauthorized";
import NotFoundPage from "./components/extra/NotFoundPage";
import Home from "./components/home/Home";
import PostPage from "./pages/PostPage";
import GetPost from "./components/post/GetPost";
import ChatPage from "./pages/ChatPage";
import AppProviders from "./context/AppProviders";
import GoogleCallback from "./components/auth/GoogelCallback";

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
          path: "/google/callback",
          element: (
            <PublicRoute>
              <GoogleCallback />
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
          path: "/chats",
          element: (
            <ProtectedRoute>
              <ChatPage />
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
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
