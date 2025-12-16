import { createContext, useContext, useState, type ReactNode } from "react";
import { db, type User } from "../db";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Optional: Check if there's a stored "session" (e.g. ID in localStorage) to auto-login
  // For now, we start logged out on refresh unless we implement persistence.

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const foundUser = await db.users.where("email").equals(email).first();
      if (foundUser && foundUser.password === password) {
        setUser(foundUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user exists
      const existingUser = await db.users.where("email").equals(email).first();
      if (existingUser) {
        return false; // Email already taken
      }

      await db.users.add({
        name,
        email,
        password,
      } as User); // ID is auto-incremented

      // Optionally auto-login after register
      // const newUser = await db.users.where("email").equals(email).first();
      // if (newUser) setUser(newUser);
      
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
