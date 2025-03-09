import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  SupabaseClient, 
  User, 
  Session, 
  AuthError, 
  AuthResponse
} from '@supabase/supabase-js';
import supabase from '@/utils/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: {}; error: AuthError | null }>;
  clearError: () => void;
  supabase: SupabaseClient;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        if (error instanceof AuthError) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await supabase.auth.signUp({ email, password });
      
      if (response.error) {
        throw response.error;
      }
      
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during sign up');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (response.error) {
        throw response.error;
      }
      
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during sign in');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during sign out');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Testing pending
  const resetPassword = async (email: string): Promise<{ data: {}; error: AuthError | null }> => {
    try {
      setLoading(true);
      setError(null);
      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (response.error) {
        throw response.error;
      }
      
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during password reset');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => setError(null);

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
    supabase
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};