import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Auth from "./layout/Auth";
import ProtectedRoute from "./routes/ProtectedRoute";
import Homepage from "./components/Home";
import UnauthorizedPage from "./components/Unauthorized";
import NotFoundPage from "./components/NotFoundPage";
import PublicRoute from "./routes/PublicRoute";

function App() {
  const router = createBrowserRouter([
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
          <Homepage />
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
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
