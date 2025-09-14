import {
    mockAuthResponses,
    mockAuthStateChangeCallback,
    mockDatabaseResponse,
    mockSession,
    mockStorageResponse,
    mockSupabaseClient,
    mockUser,
    resetSupabaseMocks,
    setupAuthErrorMocks,
    setupAuthMocks,
    setupAuthStateChangeMock,
    setupDatabaseErrorMocks,
    setupDatabaseMocks,
    setupNetworkErrorMocks,
    setupStorageErrorMocks,
    setupStorageMocks,
} from './supabase';

describe('Supabase Mocks', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  describe('Mock Data', () => {
    it('has valid mock user data', () => {
      expect(mockUser).toHaveProperty('id');
      expect(mockUser).toHaveProperty('email');
      expect(mockUser).toHaveProperty('user_metadata');
      expect(mockUser.email).toBe('test@example.com');
    });

    it('has valid mock session data', () => {
      expect(mockSession).toHaveProperty('access_token');
      expect(mockSession).toHaveProperty('refresh_token');
      expect(mockSession).toHaveProperty('user');
      expect(mockSession.user).toBe(mockUser);
    });

    it('has valid auth response structures', () => {
      expect(mockAuthResponses.success).toHaveProperty('data');
      expect(mockAuthResponses.success).toHaveProperty('error');
      expect(mockAuthResponses.success.error).toBe(null);
      expect(mockAuthResponses.success.data.user).toBe(mockUser);
    });
  });

  describe('Auth Mocks', () => {
    describe('Success scenarios', () => {
      beforeEach(() => {
        setupAuthMocks();
      });

      it('mocks successful sign in', async () => {
        const result = await mockSupabaseClient.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'password',
        });

        expect(result).toEqual(mockAuthResponses.success);
        expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password',
        });
      });

      it('mocks successful sign up', async () => {
        const result = await mockSupabaseClient.auth.signUp({
          email: 'test@example.com',
          password: 'password',
          options: { data: { full_name: 'Test User' } },
        });

        expect(result).toEqual(mockAuthResponses.success);
      });

      it('mocks successful sign out', async () => {
        const result = await mockSupabaseClient.auth.signOut();

        expect(result).toEqual({ error: null });
      });

      it('mocks successful session retrieval', async () => {
        const result = await mockSupabaseClient.auth.getSession();

        expect(result.data.session).toBe(mockSession);
        expect(result.error).toBe(null);
      });

      it('mocks successful user retrieval', async () => {
        const result = await mockSupabaseClient.auth.getUser();

        expect(result.data.user).toBe(mockUser);
        expect(result.error).toBe(null);
      });
    });

    describe('Error scenarios', () => {
      beforeEach(() => {
        setupAuthErrorMocks();
      });

      it('mocks sign in error', async () => {
        const result = await mockSupabaseClient.auth.signInWithPassword({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        });

        expect(result).toEqual(mockAuthResponses.error);
        expect(result.error.message).toBe('Invalid credentials');
      });

      it('mocks sign up error', async () => {
        const result = await mockSupabaseClient.auth.signUp({
          email: 'invalid-email',
          password: 'weak',
        });

        expect(result).toEqual(mockAuthResponses.error);
      });

      it('mocks session retrieval error', async () => {
        const result = await mockSupabaseClient.auth.getSession();

        expect(result.data.session).toBe(null);
        expect(result.error.message).toBe('Invalid credentials');
      });
    });

    describe('Network error scenarios', () => {
      beforeEach(() => {
        setupNetworkErrorMocks();
      });

      it('mocks network error on sign in', async () => {
        const result = await mockSupabaseClient.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'password',
        });

        expect(result).toEqual(mockAuthResponses.networkError);
        expect(result.error.message).toBe('Network error');
      });

      it('mocks network error on sign out', async () => {
        await expect(mockSupabaseClient.auth.signOut()).rejects.toThrow('Network error');
      });
    });

    describe('Auth state change', () => {
      beforeEach(() => {
        setupAuthStateChangeMock();
      });

      it('sets up auth state change listener', () => {
        const callback = jest.fn();
        const result = mockSupabaseClient.auth.onAuthStateChange(callback);

        expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalledWith(callback);
        expect(result.data.subscription.unsubscribe).toBeDefined();
      });

      it('can trigger auth state change', () => {
        const callback = jest.fn();
        mockSupabaseClient.auth.onAuthStateChange(callback);

        // Simulate auth state change
        mockAuthStateChangeCallback('SIGNED_IN', mockSession);

        expect(callback).toHaveBeenCalledWith('SIGNED_IN', mockSession);
      });
    });
  });

  describe('Database Mocks', () => {
    describe('Success scenarios', () => {
      beforeEach(() => {
        setupDatabaseMocks();
      });

      it('mocks successful database query', async () => {
        const query = mockSupabaseClient.from('test_table');
        const result = await query.select('*').single();

        expect(result).toEqual(mockDatabaseResponse.success);
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
      });

      it('mocks chained query methods', () => {
        const query = mockSupabaseClient.from('test_table')
          .select('*')
          .eq('id', 1)
          .single();

        expect(query).toBeDefined();
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
      });
    });

    describe('Error scenarios', () => {
      beforeEach(() => {
        setupDatabaseErrorMocks();
      });

      it('mocks database error', async () => {
        const query = mockSupabaseClient.from('test_table');
        const result = await query.select('*').single();

        expect(result).toEqual(mockDatabaseResponse.error);
        expect(result.error.message).toBe('Database error');
      });
    });
  });

  describe('Storage Mocks', () => {
    describe('Success scenarios', () => {
      beforeEach(() => {
        setupStorageMocks();
      });

      it('mocks successful file upload', async () => {
        const storage = mockSupabaseClient.storage.from('test-bucket');
        const result = await storage.upload('test-file.jpg', new Blob());

        expect(result).toEqual(mockStorageResponse.success);
        expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('test-bucket');
      });

      it('mocks successful file download', async () => {
        const storage = mockSupabaseClient.storage.from('test-bucket');
        const result = await storage.download('test-file.jpg');

        expect(result).toEqual(mockStorageResponse.success);
      });

      it('mocks successful file removal', async () => {
        const storage = mockSupabaseClient.storage.from('test-bucket');
        const result = await storage.remove(['test-file.jpg']);

        expect(result).toEqual({ error: null });
      });

      it('mocks successful file listing', async () => {
        const storage = mockSupabaseClient.storage.from('test-bucket');
        const result = await storage.list();

        expect(result.data).toHaveLength(1);
        expect(result.data[0].name).toBe('test-file.jpg');
      });
    });

    describe('Error scenarios', () => {
      beforeEach(() => {
        setupStorageErrorMocks();
      });

      it('mocks storage error', async () => {
        const storage = mockSupabaseClient.storage.from('test-bucket');
        const result = await storage.upload('test-file.jpg', new Blob());

        expect(result).toEqual(mockStorageResponse.error);
        expect(result.error.message).toBe('Storage error');
      });
    });
  });

  describe('Mock Reset', () => {
    it('resets all auth mocks', () => {
      setupAuthMocks();
      resetSupabaseMocks();

      expect(mockSupabaseClient.auth.signInWithPassword).not.toHaveBeenCalled();
      expect(mockSupabaseClient.auth.signUp).not.toHaveBeenCalled();
      expect(mockSupabaseClient.auth.signOut).not.toHaveBeenCalled();
    });

    it('resets all database mocks', () => {
      setupDatabaseMocks();
      resetSupabaseMocks();

      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('resets all storage mocks', () => {
      setupStorageMocks();
      resetSupabaseMocks();

      expect(mockSupabaseClient.storage.from).not.toHaveBeenCalled();
    });
  });
});
