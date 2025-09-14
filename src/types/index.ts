// Centralized type definitions following workspace rules
// Prefer interfaces over types as specified in rules

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: any | null; // Supabase Session type
  loading: boolean;
}

export interface ThemeMode {
  themeMode: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
}

export interface ThemedTextProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'hero';
  style?: any;
  children?: React.ReactNode;
}

export interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export interface ThemeContextType {
  themeMode: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorFallbackProps {
  onRetry: () => void;
}
