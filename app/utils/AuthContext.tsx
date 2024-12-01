"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";

// Definisi tipe data untuk payload token
interface UserPayload {
  id: string;
  email: string;
  role: string;
}

// Definisi tipe data untuk context
interface AuthContextType {
  user: UserPayload | null;
  setUser: (user: UserPayload | null) => void;
  loading: boolean;
}

// Inisialisasi context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider untuk Auth Context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);

  // Saat pertama kali mount, coba baca token dari localStorage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser: UserPayload = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null);
      }
    }
    setLoading(false); // Setelah selesai memproses
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook untuk menggunakan Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
