import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface Org {
  id: string;
  name: string;
  slug: string;
}

interface AuthContextType {
  user: User | null;
  orgs: Org[];
  currentOrg: string | null;
  setCurrentOrg: (orgId: string) => void;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [currentOrg, setCurrentOrgState] = useState<string | null>(api.getOrgId());
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
      setOrgs(data.orgs || []);
      if (data.orgs?.length && !currentOrg) {
        setCurrentOrgState(data.orgs[0].id);
        api.setOrgId(data.orgs[0].id);
      }
    } catch {
      setUser(null);
      setOrgs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const setCurrentOrg = (orgId: string) => {
    setCurrentOrgState(orgId);
    api.setOrgId(orgId);
  };

  const login = async (phone: string, password: string) => {
    await api.post('/auth/login', { phone, password });
    await refreshUser();
  };

  const register = async (name: string, phone: string, password: string) => {
    await api.post('/auth/register', { name, phone, password });
    await refreshUser();
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setOrgs([]);
    setCurrentOrgState(null);
    api.setOrgId(null);
  };

  return (
    <AuthContext.Provider value={{ user, orgs, currentOrg, setCurrentOrg, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};