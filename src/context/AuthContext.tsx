import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setAuth: (token: string | null, user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );

  const setAuth = (newToken: string | null, newUser: User | null) => {
    if (newToken && newUser) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => setAuth(null, null);

  return (
    <AuthContext.Provider value={{ token, user, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
