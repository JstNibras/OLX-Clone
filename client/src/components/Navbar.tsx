import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const cartItemCount = useAppSelector(
    (state) => state.cart.products.length
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/products" className="navbar-brand">
          <span className="navbar-logo-text">
            OLX<span>.</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <Link to="/products" className="navbar-link">
            Explore
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/cart" className="navbar-link">
                Cart
                {cartItemCount > 0 && (
                  <span className="navbar-cart-badge">{cartItemCount}</span>
                )}
              </Link>
              <Link to="/my-listings" className="navbar-link">
                My Ads
              </Link>
              <Link to="/my-orders" className="navbar-link">
                My Orders
              </Link>
              <button onClick={handleLogout} className="navbar-logout-btn">
                Logout
              </button>
              <Link to="/create-product" className="btn btn-sell">
                + Sell
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
