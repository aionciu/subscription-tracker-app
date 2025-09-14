import { getSecureErrorMessage } from '@/config/security';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (mounted) {
        if (error) {
          console.error('Error getting initial session:', error);
        }
        console.log('Initial session check:', session?.user?.id || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Failed to get initial session:', error);
      if (mounted) {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        console.log('Auth state changed:', event, session?.user?.id || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in successfully:', session.user.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Starting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('AuthContext: Sign in error:', error.message);
      // Return sanitized error for user display
      return { error: { ...error, message: getSecureErrorMessage(error) } };
    } else {
      console.log('AuthContext: Sign in successful, user:', data.user?.id);
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      console.log('AuthContext: Sign up error:', error.message);
      // Return sanitized error for user display
      return { error: { ...error, message: getSecureErrorMessage(error) } };
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('AuthContext: Starting sign out process...');
    setLoading(true); // Set loading during sign out
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthContext: Sign out error:', error);
        throw error;
      }
      console.log('AuthContext: Supabase sign out successful');
      
      // Manually clear local state as backup
      setUser(null);
      setSession(null);
      setLoading(false); // Clear loading after state is cleared
      console.log('AuthContext: Local state cleared');
    } catch (error) {
      console.error('AuthContext: Sign out failed:', error);
      // Even if Supabase fails, clear local state
      setUser(null);
      setSession(null);
      setLoading(false); // Clear loading even on error
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
