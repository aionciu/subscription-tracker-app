// Comprehensive Supabase mocks for testing
export const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    getUser: jest.fn(),
    refreshSession: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
  from: jest.fn((table: string) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    then: jest.fn(),
  })),
  storage: {
    from: jest.fn((bucket: string) => ({
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
      list: jest.fn(),
    })),
  },
};

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};

// Mock session data
export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: mockUser,
};

// Mock auth responses
export const mockAuthResponses = {
  success: {
    data: {
      user: mockUser,
      session: mockSession,
    },
    error: null,
  },
  error: {
    data: {
      user: null,
      session: null,
    },
    error: {
      message: 'Invalid credentials',
      status: 400,
    },
  },
  networkError: {
    data: {
      user: null,
      session: null,
    },
    error: {
      message: 'Network error',
      status: 0,
    },
  },
};

// Helper functions for setting up mocks
export const setupAuthMocks = () => {
  mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(mockAuthResponses.success);
  mockSupabaseClient.auth.signUp.mockResolvedValue(mockAuthResponses.success);
  mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });
  mockSupabaseClient.auth.getSession.mockResolvedValue({
    data: { session: mockSession },
    error: null,
  });
  mockSupabaseClient.auth.getUser.mockResolvedValue({
    data: { user: mockUser },
    error: null,
  });
};

export const setupAuthErrorMocks = () => {
  mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(mockAuthResponses.error);
  mockSupabaseClient.auth.signUp.mockResolvedValue(mockAuthResponses.error);
  mockSupabaseClient.auth.signOut.mockResolvedValue({ error: mockAuthResponses.error.error });
  mockSupabaseClient.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: mockAuthResponses.error.error,
  });
};

export const setupNetworkErrorMocks = () => {
  mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(mockAuthResponses.networkError);
  mockSupabaseClient.auth.signUp.mockResolvedValue(mockAuthResponses.networkError);
  mockSupabaseClient.auth.signOut.mockRejectedValue(new Error('Network error'));
  mockSupabaseClient.auth.getSession.mockRejectedValue(new Error('Network error'));
};

// Reset all mocks
export const resetSupabaseMocks = () => {
  Object.values(mockSupabaseClient.auth).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
  
  if (jest.isMockFunction(mockSupabaseClient.from)) {
    mockSupabaseClient.from.mockReset();
  }
  
  if (jest.isMockFunction(mockSupabaseClient.storage.from)) {
    mockSupabaseClient.storage.from.mockReset();
  }
};

// Mock auth state change callback
export const mockAuthStateChangeCallback = jest.fn();

export const setupAuthStateChangeMock = () => {
  mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
    mockAuthStateChangeCallback.mockImplementation(callback);
    return {
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    };
  });
};

// Database mocks
export const mockDatabaseResponse = {
  success: {
    data: [{ id: 1, name: 'Test Item' }],
    error: null,
  },
  error: {
    data: null,
    error: {
      message: 'Database error',
      code: 'PGRST116',
    },
  },
};

export const setupDatabaseMocks = () => {
  const mockQuery = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(mockDatabaseResponse.success),
    then: jest.fn().mockResolvedValue(mockDatabaseResponse.success),
  };
  
  mockSupabaseClient.from.mockImplementation((table: string) => mockQuery);
};

export const setupDatabaseErrorMocks = () => {
  const mockQuery = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(mockDatabaseResponse.error),
    then: jest.fn().mockResolvedValue(mockDatabaseResponse.error),
  };
  
  mockSupabaseClient.from.mockImplementation((table: string) => mockQuery);
};

// Storage mocks
export const mockStorageResponse = {
  success: {
    data: { path: 'uploads/test-file.jpg' },
    error: null,
  },
  error: {
    data: null,
    error: {
      message: 'Storage error',
      statusCode: '400',
    },
  },
};

export const setupStorageMocks = () => {
  const mockStorage = {
    upload: jest.fn().mockResolvedValue(mockStorageResponse.success),
    download: jest.fn().mockResolvedValue(mockStorageResponse.success),
    remove: jest.fn().mockResolvedValue({ error: null }),
    list: jest.fn().mockResolvedValue({
      data: [{ name: 'test-file.jpg', size: 1024 }],
      error: null,
    }),
  };
  
  mockSupabaseClient.storage.from.mockImplementation((bucket: string) => mockStorage);
};

export const setupStorageErrorMocks = () => {
  const mockStorage = {
    upload: jest.fn().mockResolvedValue(mockStorageResponse.error),
    download: jest.fn().mockResolvedValue(mockStorageResponse.error),
    remove: jest.fn().mockResolvedValue(mockStorageResponse.error),
    list: jest.fn().mockResolvedValue(mockStorageResponse.error),
  };
  
  mockSupabaseClient.storage.from.mockImplementation((bucket: string) => mockStorage);
};
