import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  phone: string;
  role: "owner" | "manager" | "tenant";
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => void;
  register: (name: string, phone: string, role: User["role"], password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (phone: string, _password: string) => {
    setUser({ name: "Mushfiqur Rahman", phone, role: "owner" });
  };

  const register = (name: string, phone: string, role: User["role"], _password: string) => {
    setUser({ name, phone, role });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
