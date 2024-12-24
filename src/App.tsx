import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Root from "./pages/Root";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./authentication/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "admin",
        element: <ProtectedRoute element={<AdminPage />} />,
      },
      {
        index: true, // Default child route for the root "/"
        element: <Navigate to="/login" replace />, // Redirect to "/login"
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
