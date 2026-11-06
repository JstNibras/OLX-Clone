import {
  BrowserRouter,
  Routes,
  Route,
  Link,
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
import Navbar from "../components/Navbar";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import { useAppSelector } from "../app/hooks";

const HomePage = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="page-container">
      <div className="home-hero">
        <h1 className="home-hero-title">Buy & Sell Anything Near You</h1>
        <p className="home-hero-subtitle">
          {user
            ? `Welcome back, ${user.name}! Discover today's top deals or list something to sell.`
            : "The trusted community marketplace for cars, electronics, furniture, mobiles, and more."}
        </p>
        <div className="home-hero-cta">
          <Link to="/products" className="btn btn-sell btn-lg">
            Browse All Ads
          </Link>
          <Link
            to="/create-product"
            className="btn btn-outline btn-lg"
            style={{ color: "#ffffff", borderColor: "#ffffff" }}
          >
            + Start Selling
          </Link>
        </div>
      </div>

      <ProductsPage />
    </div>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
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
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
