import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProductsPage from "../pages/auth/ProductsPage";
import ProductDetailsPage from "../pages/auth/ProductDetailsPage";
import CartPage from "../pages/auth/CartPage";
import CheckoutPage from "../pages/auth/CheckoutPage";
import OrderSuccessPage from "../pages/auth/OrderSuccessPage";
import MyOrdersPage from "../pages/auth/myOrdersPage";
import OrderDetailsPage from "../pages/auth/OrderDetailsPage";
import MyListingsPage from "../pages/auth/myListingsPage";
import CreateProductPage from "../pages/auth/CreateProductPage";
import EditProductPage from "../pages/auth/EditProductPage";

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
        <Route path="/products/:id" element={<ProductDetailsPage />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/sell" element={<h1>Sell Product Page</h1>} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;