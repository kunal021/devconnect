import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Auth from "./layout/Auth";
import ProtectedRoute from "./routes/ProtectedRoute";
import UnauthorizedPage from "./components/Unauthorized";
import NotFoundPage from "./components/NotFoundPage";
import PublicRoute from "./routes/PublicRoute";
import Layout from "./layout/Layout";
import { ThemeProvider } from "./context/ThemeProvider";
import HomePage from "./pages/HomePage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";

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
          path: "/home",
          element: (
            <ProtectedRoute>
              <HomePage />
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
    <ThemeProvider defaultTheme="dark" storageKey="devconnect-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
