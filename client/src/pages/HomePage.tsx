import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import ProductsPage from "./ProductsPage";

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

export default HomePage;

