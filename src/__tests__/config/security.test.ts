import {
    getSecureErrorMessage,
    getSecurityHeaders,
    sanitizeInput,
    validateEmail,
    validateEnvironment,
    validateFullName,
    validatePassword,
} from '@/config/security';

// Mock process.env
const originalEnv = process.env;

describe('Security Configuration', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('validateEnvironment', () => {
    it('should return credentials when environment variables are set', () => {
      process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

      const result = validateEnvironment();

      expect(result).toEqual({
        supabaseUrl: 'https://test.supabase.co',
        supabaseKey: 'test-key',
      });
    });

    it('should throw error when Supabase URL is missing', () => {
      process.env.EXPO_PUBLIC_SUPABASE_URL = '';
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

      expect(() => validateEnvironment()).toThrow(
        'Missing Supabase credentials. Please create a .env.local file with:\n' +
        'EXPO_PUBLIC_SUPABASE_URL=your_supabase_url\n' +
        'EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key'
      );
    });

    it('should throw error when Supabase key is missing', () => {
      process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = '';

      expect(() => validateEnvironment()).toThrow(
        'Missing Supabase credentials. Please create a .env.local file with:\n' +
        'EXPO_PUBLIC_SUPABASE_URL=your_supabase_url\n' +
        'EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key'
      );
    });

    it('should throw error when both credentials are missing', () => {
      process.env.EXPO_PUBLIC_SUPABASE_URL = '';
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = '';

      expect(() => validateEnvironment()).toThrow(
        'Missing Supabase credentials. Please create a .env.local file with:\n' +
        'EXPO_PUBLIC_SUPABASE_URL=your_supabase_url\n' +
        'EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key'
      );
    });
  });

  describe('validateEmail', () => {
    it('should return valid for correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return invalid for whitespace-only email', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return invalid for malformed email', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should return invalid for email without domain', () => {
      const result = validateEmail('user@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should return invalid for email without user', () => {
      const result = validateEmail('@example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should return invalid for email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email address is too long');
    });

    it('should handle email with special characters', () => {
      const result = validateEmail('user.name+tag@example.co.uk');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validatePassword', () => {
    it('should return valid for correct password', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should return invalid for password that is too short', () => {
      const result = validatePassword('Pass1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters long');
    });

    it('should return invalid for password that is too long', () => {
      const longPassword = 'A'.repeat(130);
      const result = validatePassword(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is too long');
    });

    it('should return invalid for password without uppercase', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one uppercase letter');
    });

    it('should return invalid for password without lowercase', () => {
      const result = validatePassword('PASSWORD123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one lowercase letter');
    });

    it('should return invalid for password without number', () => {
      const result = validatePassword('Password');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one number');
    });

    it('should handle password with special characters', () => {
      const result = validatePassword('Password123!@#');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validateFullName', () => {
    it('should return valid for correct full name', () => {
      const result = validateFullName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for name with hyphen', () => {
      const result = validateFullName('Mary-Jane Smith');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for name with apostrophe', () => {
      const result = validateFullName("O'Connor");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty name', () => {
      const result = validateFullName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is required');
    });

    it('should return invalid for whitespace-only name', () => {
      const result = validateFullName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is required');
    });

    it('should return invalid for name that is too short', () => {
      const result = validateFullName('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name must be at least 2 characters long');
    });

    it('should return invalid for name that is too long', () => {
      const longName = 'A'.repeat(101);
      const result = validateFullName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is too long');
    });

    it('should return invalid for name with numbers', () => {
      const result = validateFullName('John123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should return invalid for name with special characters', () => {
      const result = validateFullName('John@Doe');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should handle name with multiple spaces', () => {
      const result = validateFullName('John   Doe');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      const result = sanitizeInput('  test  ');
      expect(result).toBe('test');
    });

    it('should remove angle brackets', () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result).toBe('scriptalert("xss")/script');
    });

    it('should handle empty string', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });

    it('should handle string with only angle brackets', () => {
      const result = sanitizeInput('<>');
      expect(result).toBe('');
    });

    it('should preserve other characters', () => {
      const result = sanitizeInput('Hello World!');
      expect(result).toBe('Hello World!');
    });

    it('should handle mixed content', () => {
      const result = sanitizeInput('  <script>Hello</script> World!  ');
      expect(result).toBe('scriptHello/script World!');
    });
  });

  describe('getSecureErrorMessage', () => {
    it('should return generic message for unknown error', () => {
      const result = getSecureErrorMessage(new Error('Unknown error'));
      expect(result).toBe('Something went wrong. Please try again.');
    });

    it('should return generic message for error without message', () => {
      const result = getSecureErrorMessage({});
      expect(result).toBe('Something went wrong. Please try again.');
    });

    it('should return generic message for null/undefined error', () => {
      const result1 = getSecureErrorMessage(null);
      const result2 = getSecureErrorMessage(undefined);
      expect(result1).toBe('Something went wrong. Please try again.');
      expect(result2).toBe('Something went wrong. Please try again.');
    });

    it('should map Invalid login credentials error', () => {
      const result = getSecureErrorMessage(new Error('Invalid login credentials'));
      expect(result).toBe('Invalid email or password');
    });

    it('should map User already registered error', () => {
      const result = getSecureErrorMessage(new Error('User already registered'));
      expect(result).toBe('An account with this email already exists');
    });

    it('should map Password should be at least error', () => {
      const result = getSecureErrorMessage(new Error('Password should be at least 8 characters'));
      expect(result).toBe('Password does not meet security requirements');
    });

    it('should map Invalid email error', () => {
      const result = getSecureErrorMessage(new Error('Invalid email'));
      expect(result).toBe('Please enter a valid email address');
    });

    it('should handle partial error message matches', () => {
      const result = getSecureErrorMessage(new Error('Some Invalid login credentials error'));
      expect(result).toBe('Invalid email or password');
    });

    it('should handle case insensitive error messages', () => {
      const result = getSecureErrorMessage(new Error('INVALID LOGIN CREDENTIALS'));
      expect(result).toBe('Invalid email or password');
    });
  });

  describe('getSecurityHeaders', () => {
    it('should return security headers object', () => {
      const headers = getSecurityHeaders();

      expect(headers).toEqual({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      });
    });

    it('should return consistent headers on multiple calls', () => {
      const headers1 = getSecurityHeaders();
      const headers2 = getSecurityHeaders();

      expect(headers1).toEqual(headers2);
    });

    it('should include all required security headers', () => {
      const headers = getSecurityHeaders();

      expect(headers).toHaveProperty('X-Content-Type-Options');
      expect(headers).toHaveProperty('X-Frame-Options');
      expect(headers).toHaveProperty('X-XSS-Protection');
      expect(headers).toHaveProperty('Referrer-Policy');
      expect(headers).toHaveProperty('Permissions-Policy');
    });
  });
});
