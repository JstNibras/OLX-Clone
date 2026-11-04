import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProductsPage from "../pages/auth/ProductsPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <h1>Home Page</h1>

      {user && <p>Welcome, {user.name}</p>}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        
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