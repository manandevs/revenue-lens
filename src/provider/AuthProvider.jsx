import { useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState("hello this is auth session");
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ session }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}