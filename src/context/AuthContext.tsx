import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, Role } from '../types';
import { DEMO_STUDENT, DEMO_ADMIN } from '../services/mockData';

interface AuthContextType {
  user: Profile | null;
  role: Role | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (email: string, password?: string, targetRole?: Role) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: { full_name?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'sc_active_user_v1';
const REGISTERED_USERS_KEY = 'sc_registered_users_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile);
              setIsLoading(false);
              return;
            }
          }
        }

        // Check local storage fallback session
        const saved = localStorage.getItem(LOCAL_USER_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          // Default to student demo user for frictionless review
          setUser(DEMO_STUDENT);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEMO_STUDENT));
        }
      } catch (e) {
        console.error('Auth initialization error', e);
        setUser(DEMO_STUDENT);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (profile) {
              setUser(profile);
              localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
            }
          } else {
            setUser(null);
            localStorage.removeItem(LOCAL_USER_KEY);
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (
    email: string,
    password?: string,
    targetRole?: Role
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Check Supabase if configured
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (pError || !profile) {
            setIsLoading(false);
            return { success: false, error: 'User profile not found in database.' };
          }

          if (targetRole && profile.role !== targetRole) {
            await supabase.auth.signOut();
            setIsLoading(false);
            return {
              success: false,
              error: `Access denied: This portal is for ${targetRole}s only.`,
            };
          }

          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          setIsLoading(false);
          return { success: true };
        }
      }

      // Demo/Fallback authentication handler
      if (cleanEmail === DEMO_ADMIN.email) {
        if (targetRole && targetRole !== 'admin') {
          setIsLoading(false);
          return { success: false, error: 'Cannot log into student portal as administrator.' };
        }
        setUser(DEMO_ADMIN);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEMO_ADMIN));
        setIsLoading(false);
        return { success: true };
      }

      if (cleanEmail === DEMO_STUDENT.email) {
        if (targetRole === 'admin') {
          setIsLoading(false);
          return { success: false, error: 'Access denied: You do not have administrator permissions.' };
        }
        setUser(DEMO_STUDENT);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEMO_STUDENT));
        setIsLoading(false);
        return { success: true };
      }

      // Check registered students in local store
      const registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      const found = registered.find((u: Profile) => u.email.toLowerCase() === cleanEmail);

      if (found) {
        if (targetRole && found.role !== targetRole) {
          setIsLoading(false);
          return { success: false, error: `Access denied: Role mismatch.` };
        }
        setUser(found);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(found));
        setIsLoading(false);
        return { success: true };
      }

      // If mock login without pre-registration
      if (targetRole === 'admin') {
        setIsLoading(false);
        return { success: false, error: 'Invalid admin credentials. Use admin@campus.edu or trusted admin account.' };
      }

      // Auto-create student profile if testing
      const newStudent: Profile = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        full_name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'student',
        phone: '+91 90000 00000',
        created_at: new Date().toISOString(),
      };
      setUser(newStudent);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newStudent));
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const register = async (
    fullName: string,
    email: string,
    phone: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Profile trigger will insert role: 'student' automatically
          const profile: Profile = {
            id: data.user.id,
            full_name: fullName.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            role: 'student',
            created_at: new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          setIsLoading(false);
          return { success: true };
        }
      }

      // Fallback registration:
      const registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      if (registered.some((u: Profile) => u.email.toLowerCase() === cleanEmail) || cleanEmail === DEMO_STUDENT.email) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email address already exists.' };
      }

      const newStudent: Profile = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        full_name: fullName.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        role: 'student', // strictly enforced student role
        created_at: new Date().toISOString(),
      };

      registered.push(newStudent);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
      setUser(newStudent);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newStudent));

      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
    setIsLoading(false);
  };

  const updateProfile = async (updates: { full_name?: string; phone?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updates.full_name,
            phone: updates.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) return { success: false, error: error.message };
      }

      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Profile update failed' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw new Error(error.message);
    }
    return {
      success: true,
      message: `A password reset link has been dispatched to ${email.trim()}. Please check your college inbox.`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
