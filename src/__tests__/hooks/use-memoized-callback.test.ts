import { useMemoizedCallback, useMemoizedValue } from '@/hooks/use-memoized-callback';

// Mock React hooks
jest.mock('react', () => ({
  useCallback: jest.fn((callback, deps) => callback),
  useMemo: jest.fn((factory, deps) => factory()),
}));

describe('useMemoizedCallback Hook', () => {
  const mockUseCallback = require('react').useCallback;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useMemoizedCallback', () => {
    it('calls useCallback with correct parameters', () => {
      const mockCallback = jest.fn();
      const mockDeps = ['dep1', 'dep2'];

      useMemoizedCallback(mockCallback, mockDeps);

      expect(mockUseCallback).toHaveBeenCalledWith(mockCallback, mockDeps);
    });

    it('returns the callback function', () => {
      const mockCallback = jest.fn();
      const mockDeps = ['dep1'];

      const result = useMemoizedCallback(mockCallback, mockDeps);

      expect(result).toBe(mockCallback);
    });

    it('handles empty dependencies array', () => {
      const mockCallback = jest.fn();

      useMemoizedCallback(mockCallback, []);

      expect(mockUseCallback).toHaveBeenCalledWith(mockCallback, []);
    });

    it('handles multiple dependencies', () => {
      const mockCallback = jest.fn();
      const mockDeps = ['dep1', 'dep2', 'dep3'];

      useMemoizedCallback(mockCallback, mockDeps);

      expect(mockUseCallback).toHaveBeenCalledWith(mockCallback, mockDeps);
    });
  });

  describe('useMemoizedValue', () => {
    const mockUseMemo = require('react').useMemo;

    it('calls useMemo with correct parameters', () => {
      const mockFactory = jest.fn(() => 'test value');
      const mockDeps = ['dep1', 'dep2'];

      useMemoizedValue(mockFactory, mockDeps);

      expect(mockUseMemo).toHaveBeenCalledWith(mockFactory, mockDeps);
    });

    it('returns the factory result', () => {
      const mockFactory = jest.fn(() => 'test value');
      const mockDeps = ['dep1'];

      const result = useMemoizedValue(mockFactory, mockDeps);

      expect(result).toBe('test value');
    });

    it('handles empty dependencies array', () => {
      const mockFactory = jest.fn(() => 'test value');

      useMemoizedValue(mockFactory, []);

      expect(mockUseMemo).toHaveBeenCalledWith(mockFactory, []);
    });

    it('handles factory function that returns different types', () => {
      const stringFactory = jest.fn(() => 'string value');
      const numberFactory = jest.fn(() => 42);
      const objectFactory = jest.fn(() => ({ key: 'value' }));

      const stringResult = useMemoizedValue(stringFactory, []);
      const numberResult = useMemoizedValue(numberFactory, []);
      const objectResult = useMemoizedValue(objectFactory, []);

      expect(stringResult).toBe('string value');
      expect(numberResult).toBe(42);
      expect(objectResult).toEqual({ key: 'value' });
    });
  });

  describe('Integration', () => {
    it('both hooks work together', () => {
      const mockCallback = jest.fn();
      const mockFactory = jest.fn(() => 'value');
      const mockDeps = ['dep'];

      const callbackResult = useMemoizedCallback(mockCallback, mockDeps);
      const valueResult = useMemoizedValue(mockFactory, mockDeps);

      expect(callbackResult).toBe(mockCallback);
      expect(valueResult).toBe('value');
    });
  });
});
