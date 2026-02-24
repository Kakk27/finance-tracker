import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';

const AUTH_KEY = 'kakk_hean_auth';
const USER_KEY = 'kakk_hean_user';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem(AUTH_KEY);
        const userData = localStorage.getItem(USER_KEY);
        
        if (authStatus === 'true' && userData) {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = useCallback(async (email: string, name: string): Promise<boolean> => {
    try {
      // Simple mock auth - in real app, this would validate credentials
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: name || 'User',
        email: email,
        joinedAt: new Date().toISOString(),
      };

      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Sign in failed:', error);
      return false;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update user failed:', error);
      return false;
    }
  }, [user]);

  return {
    isAuthenticated,
    user,
    isLoading,
    signIn,
    signOut,
    updateUser,
  };
}
