import { getSecureErrorMessage } from '@/config/security';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: Session | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SIGN_OUT' };

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SIGN_OUT':
      return { user: null, session: null, loading: false };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (mounted) {
        if (error) {
          console.error('Error getting initial session:', error);
        }
        console.log('Initial session check:', session?.user?.id || 'No user');
        dispatch({ type: 'SET_SESSION', payload: session });
        dispatch({ type: 'SET_USER', payload: session?.user ?? null });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }).catch((error) => {
      console.error('Failed to get initial session:', error);
      if (mounted) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        console.log('Auth state changed:', event, session?.user?.id || 'No user');
        dispatch({ type: 'SET_SESSION', payload: session });
        dispatch({ type: 'SET_USER', payload: session?.user ?? null });
        dispatch({ type: 'SET_LOADING', payload: false });

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

  const signIn = useCallback(async (email: string, password: string) => {
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
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
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
  }, []);

  const signOut = useCallback(async () => {
    console.log('AuthContext: Starting sign out process...');
    dispatch({ type: 'SET_LOADING', payload: true }); // Set loading during sign out
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthContext: Sign out error:', error);
        throw error;
      }
      console.log('AuthContext: Supabase sign out successful');
      
      // Manually clear local state as backup
      dispatch({ type: 'SIGN_OUT' });
      console.log('AuthContext: Local state cleared');
    } catch (error) {
      console.error('AuthContext: Sign out failed:', error);
      // Even if Supabase fails, clear local state
      dispatch({ type: 'SIGN_OUT' });
      throw error;
    }
  }, []);

  const value = {
    user: state.user,
    session: state.session,
    loading: state.loading,
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
