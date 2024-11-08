import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Auth from "./layout/Auth";
import ProtectedRoute from "./routes/ProtectedRoute";
import Homepage from "./components/Home";
import UnauthorizedPage from "./components/Unauthorized";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/auth/login",
      element: <Auth />,
    },
    {
      path: "/auth/signup",
      element: <Auth />,
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
