import { useEffect, useState } from "react";
import { checkServerHealth } from "./services/healthService";

function App() {
  const [message, setMessage] = useState("Checking server....")
  const [ error, setError] = useState("");

  useEffect(() => {
    const testConnection  = async () => {
      try {
        const data = await checkServerHealth();
        setMessage(data.message);
      } catch {
        setError("unable to connect to the backend.")
      }
    }

    testConnection();
  }, []);

  return (
    <div>
      <h1>OLX Marketplace</h1>

      {error ? (
        <p>{error}</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  )
}

export default App;