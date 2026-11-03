import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<h1>Cart Page</h1>} />
          <Route path="/checkout" element={<h1>Checkout Page</h1>} />
          <Route path="/sell" element={<h1>Sell Product Page</h1>} />
          <Route path="/my-listings" element={<h1>My Listings</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;