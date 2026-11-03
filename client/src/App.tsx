import { useEffect } from "react";

import AppRouter from "./routes/AppRouter";
import { useAppDispatch } from "./app/hooks";
import { initializeAuth } from "./features/auth/authSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(initializeAuth());
    }
  }, [dispatch]);

  return <AppRouter />;
}

export default App;