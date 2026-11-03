import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const PublicRoute = () => {
    const { isAuthenticated, isInitializing } = useAppSelector(
        (state) => state.auth
    );

    if (isInitializing) {
        return <p>Checking Authentication...</p>
    }

    if(isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PublicRoute;