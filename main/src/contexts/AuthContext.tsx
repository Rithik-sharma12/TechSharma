import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserRole {
  id: number;
  name: string;
  type: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userRole: string | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

// Helper function to check if user has admin privileges
const checkIsAdmin = (user: User | null): boolean => {
  if (!user?.role) return false;
  const roleName = user.role.name?.toLowerCase();
  const roleType = user.role.type?.toLowerCase();
  return (
    roleName === 'admin' || 
    roleName === 'administrator' || 
    roleName === 'super admin' ||
    roleType === 'admin' ||
    roleType === 'administrator'
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (jwt: string) => {
    try {
      const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Token invalid, clear session
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Fetch user with role populated
        const userResponse = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
          headers: {
            Authorization: `Bearer ${data.jwt}`,
          },
        });
        const userData = await userResponse.json();

        setToken(data.jwt);
        setUser(userData);
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: data.error?.message || 'Invalid credentials' };
      }
    } catch (error: any) {
      return { success: false, error: error?.message || 'Network error. Please check if the server is running.' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.jwt);
        setUser(data.user);
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error?.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, error: error?.message || 'Network error. Please check if the server is running.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = checkIsAdmin(user);
  const userRole = user?.role?.name || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        userRole,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
