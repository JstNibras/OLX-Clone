import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">
        <h2>OLX</h2>
      </Link>

      <div>
        <Link to="/">Products</Link>

        {isAuthenticated && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/my-listings">My Listings</Link>

            <Link to="/create-product">
              + Sell
            </Link>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {!isAuthenticated && (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;