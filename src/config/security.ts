// Security Configuration
// This file contains security-related constants and validation functions

// Environment validation
export const validateEnvironment = () => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase credentials. Please create a .env.local file with:\n' +
      'EXPO_PUBLIC_SUPABASE_URL=your_supabase_url\n' +
      'EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key'
    );
  }

  return { supabaseUrl, supabaseKey };
};

// Input validation functions
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

export const validateFullName = (fullName: string): { isValid: boolean; error?: string } => {
  if (!fullName || fullName.trim().length === 0) {
    return { isValid: false, error: 'Full name is required' };
  }

  if (fullName.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters long' };
  }

  if (fullName.length > 100) {
    return { isValid: false, error: 'Full name is too long' };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(fullName.trim())) {
    return { isValid: false, error: 'Full name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true };
};

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Secure error handling
export const getSecureErrorMessage = (error: any): string => {
  // Don't expose internal errors to users
  const errorMessage = error?.message || 'An error occurred';
  const lowerErrorMessage = errorMessage.toLowerCase();
  
  // Map common Supabase errors to user-friendly messages
  if (lowerErrorMessage.includes('invalid login credentials')) {
    return 'Invalid email or password';
  }
  
  if (lowerErrorMessage.includes('user already registered')) {
    return 'An account with this email already exists';
  }
  
  if (lowerErrorMessage.includes('password should be at least')) {
    return 'Password does not meet security requirements';
  }
  
  if (lowerErrorMessage.includes('invalid email')) {
    return 'Please enter a valid email address';
  }
  
  // Generic error for unknown issues
  return 'Something went wrong. Please try again.';
};

// Security headers configuration
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
};
