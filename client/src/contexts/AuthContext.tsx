import {
  useEffect,
  createContext,
  useState,
  useContext,
  useCallback,
} from "react";
import { IAuthState, IAuthTokenDecoded } from "@/common/interfaces";
import jwt from "jsonwebtoken";

const initialState: IAuthState = {
  token: null,
  decodedToken: null,
};

interface IAuthContext {
  authState: IAuthState | undefined;
  updateAuthToken: (token: string) => void;
  clearAuthState: () => void;
  isAuthenticated: () => boolean;
  getAuthState: () => IAuthState;
}

// Create a context for managing user authentication state
export const AuthContext = createContext<IAuthContext>({
  authState: undefined,
  updateAuthToken: () => null,
  clearAuthState: () => null,
  isAuthenticated: () => false,
  getAuthState: () => initialState, 
});

// Hook to access the authentication state throughout the app
export function useAuth() {
  return useContext(AuthContext);
}

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<IAuthState>(initialState);

  const generateAuthStateFromToken = (token: string): IAuthState => {
    try {
      const decodedToken = jwt.decode(token) as IAuthTokenDecoded;
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();
      return {
        token: isTokenExpired ? null : token,
        decodedToken: isTokenExpired ? null : decodedToken,
      };
    } catch (error) {
      console.error("Failed to generate auth state:", error);
      return {
        token: null,
        decodedToken: null,
      };
    }
  };

  const updateAuthToken = useCallback((token: string) => {
    const authState = generateAuthStateFromToken(token);
    localStorage.setItem("token", token);
    setAuthState(authState);
  }, []);

  const clearAuthState = () => {
    setAuthState({
      token: null,
      decodedToken: null,
    });
    localStorage.removeItem("token");
  };

  const isAuthenticated = useCallback(() => {
    const token = authState.token || localStorage.getItem("token");
    if (!token) return false;
    const decodedState = generateAuthStateFromToken(token);
    setAuthState(decodedState);
    return decodedState.decodedToken ? decodedState.decodedToken.exp * 1000 > Date.now() : false;
  }, [authState.token]);

  const getAuthState = useCallback(() => {
    if (typeof window === "undefined") {
      return authState;
    }
    const token = localStorage.getItem("token");
    if (token) {
      return generateAuthStateFromToken(token);
    }
    return authState;
  }, [authState]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      updateAuthToken(token);
    }
  }, [updateAuthToken]);

  return (
    <AuthContext.Provider
      value={{ authState, updateAuthToken, clearAuthState, isAuthenticated, getAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
