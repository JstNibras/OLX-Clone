import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { initializeAuth } from "./features/auth/authSlice";
import AppRouter from "./routes/AppRouter";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return <AppRouter />;
}

export default App;