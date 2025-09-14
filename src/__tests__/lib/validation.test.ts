import {
    emailSchema,
    fullNameSchema,
    loginSchema,
    passwordSchema,
    registerSchema,
    validateEmail,
    validateFullName,
    validateLoginForm,
    validatePassword,
    validateRegisterForm,
    type LoginFormData,
    type RegisterFormData,
} from '@/lib/validation';

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
      ];

      validEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user@example..com',
        'a'.repeat(250) + '@example.com', // Too long
      ];

      invalidEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });

    it('should reject empty email', () => {
      expect(() => emailSchema.parse('')).toThrow('Email is required');
    });

    it('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(() => emailSchema.parse(longEmail)).toThrow('Email address is too long');
    });
  });

  describe('passwordSchema', () => {
    it('should validate correct passwords', () => {
      const validPasswords = [
        'Password123',
        'MySecure1',
        'TestPass9',
        'ComplexP@ssw0rd',
      ];

      validPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).not.toThrow();
      });
    });

    it('should reject passwords without uppercase letter', () => {
      expect(() => passwordSchema.parse('password123')).toThrow('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without lowercase letter', () => {
      expect(() => passwordSchema.parse('PASSWORD123')).toThrow('Password must contain at least one lowercase letter');
    });

    it('should reject passwords without number', () => {
      expect(() => passwordSchema.parse('Password')).toThrow('Password must contain at least one number');
    });

    it('should reject passwords that are too short', () => {
      expect(() => passwordSchema.parse('Pass1')).toThrow('Password must be at least 8 characters long');
    });

    it('should reject passwords that are too long', () => {
      const longPassword = 'A'.repeat(130);
      expect(() => passwordSchema.parse(longPassword)).toThrow('Password is too long');
    });

    it('should reject empty password', () => {
      expect(() => passwordSchema.parse('')).toThrow('Password is required');
    });
  });

  describe('fullNameSchema', () => {
    it('should validate correct full names', () => {
      const validNames = [
        'John Doe',
        'Mary-Jane Smith',
        "O'Connor",
        'Jean-Pierre',
        'José María',
        'AB', // Two characters (minimum)
      ];

      validNames.forEach(name => {
        expect(() => fullNameSchema.parse(name)).not.toThrow();
      });
    });

    it('should reject names with invalid characters', () => {
      const invalidNames = [
        'John123',
        'Mary@Smith',
        'John.Doe',
        'Mary$Smith',
        'John#Doe',
      ];

      invalidNames.forEach(name => {
        expect(() => fullNameSchema.parse(name)).toThrow('Full name can only contain letters, spaces, hyphens, and apostrophes');
      });
    });

    it('should reject names that are too short', () => {
      expect(() => fullNameSchema.parse('')).toThrow('Full name is required');
    });

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(101);
      expect(() => fullNameSchema.parse(longName)).toThrow('Full name is too long');
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validLoginData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      expect(() => loginSchema.parse(validLoginData)).not.toThrow();
    });

    it('should reject invalid login data', () => {
      const invalidLoginData = {
        email: 'invalid-email',
        password: 'weak',
      };

      expect(() => loginSchema.parse(invalidLoginData)).toThrow();
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validRegisterData = {
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'John Doe',
      };

      expect(() => registerSchema.parse(validRegisterData)).not.toThrow();
    });

    it('should reject invalid registration data', () => {
      const invalidRegisterData = {
        email: 'invalid-email',
        password: 'weak',
        fullName: 'John123',
      };

      expect(() => registerSchema.parse(invalidRegisterData)).toThrow();
    });
  });
});

describe('Validation Helper Functions', () => {
  describe('validateEmail', () => {
    it('should return valid for correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for incorrect email', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should return invalid for empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return invalid for too long email', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email address is too long');
    });
  });

  describe('validatePassword', () => {
    it('should return valid for correct password', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
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

    it('should return invalid for too short password', () => {
      const result = validatePassword('Pass1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters long');
    });

    it('should return invalid for empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
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

    it('should return invalid for name with numbers', () => {
      const result = validateFullName('John123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should return invalid for empty name', () => {
      const result = validateFullName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is required');
    });

    it('should return invalid for too short name', () => {
      const result = validateFullName('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name must be at least 2 characters long');
    });
  });

  describe('validateLoginForm', () => {
    it('should return valid for correct login data', () => {
      const result = validateLoginForm({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return invalid with errors for incorrect data', () => {
      const result = validateLoginForm({
        email: 'invalid-email',
        password: 'weak',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe('Password must contain at least one number');
    });

    it('should return invalid for missing fields', () => {
      const result = validateLoginForm({
        email: '',
        password: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe('Password must contain at least one number');
    });
  });

  describe('validateRegisterForm', () => {
    it('should return valid for correct registration data', () => {
      const result = validateRegisterForm({
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'John Doe',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return invalid with errors for incorrect data', () => {
      const result = validateRegisterForm({
        email: 'invalid-email',
        password: 'weak',
        fullName: 'John123',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe('Password must contain at least one number');
      expect(result.errors.fullName).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should return invalid for missing fields', () => {
      const result = validateRegisterForm({
        email: '',
        password: '',
        fullName: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe('Password must contain at least one number');
      expect(result.errors.fullName).toBe('Full name can only contain letters, spaces, hyphens, and apostrophes');
    });
  });
});

describe('Type Exports', () => {
  it('should export correct types', () => {
    // This test ensures the types are properly exported
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'Password123',
    };

    const registerData: RegisterFormData = {
      email: 'test@example.com',
      password: 'Password123',
      fullName: 'John Doe',
    };

    expect(loginData).toBeDefined();
    expect(registerData).toBeDefined();
  });
});
