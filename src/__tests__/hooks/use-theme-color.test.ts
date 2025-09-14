import { useThemeColor } from '@/hooks/use-theme-color';

// Mock the ThemeContext
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

// Mock the theme constants
jest.mock('@/constants/theme', () => ({
  Colors: {
    light: {
      text: '#000000',
      background: '#FFFFFF',
      primary: '#3B82F6',
      border: '#E5E7EB',
    },
    dark: {
      text: '#FFFFFF',
      background: '#000000',
      primary: '#60A5FA',
      border: '#374151',
    },
  },
}));

describe('useThemeColor Hook', () => {
  const mockUseTheme = require('@/contexts/ThemeContext').useTheme;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Light Theme', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({ themeMode: 'light' });
    });

    it('returns light theme color when no props provided', () => {
      const result = useThemeColor({}, 'text');
      expect(result).toBe('#000000');
    });

    it('returns light theme primary color', () => {
      const result = useThemeColor({}, 'primary');
      expect(result).toBe('#3B82F6');
    });

    it('returns light theme background color', () => {
      const result = useThemeColor({}, 'background');
      expect(result).toBe('#FFFFFF');
    });

    it('returns light theme border color', () => {
      const result = useThemeColor({}, 'border');
      expect(result).toBe('#E5E7EB');
    });
  });

  describe('Dark Theme', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({ themeMode: 'dark' });
    });

    it('returns dark theme color when no props provided', () => {
      const result = useThemeColor({}, 'text');
      expect(result).toBe('#FFFFFF');
    });

    it('returns dark theme primary color', () => {
      const result = useThemeColor({}, 'primary');
      expect(result).toBe('#60A5FA');
    });

    it('returns dark theme background color', () => {
      const result = useThemeColor({}, 'background');
      expect(result).toBe('#000000');
    });

    it('returns dark theme border color', () => {
      const result = useThemeColor({}, 'border');
      expect(result).toBe('#374151');
    });
  });

  describe('Custom Colors from Props', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({ themeMode: 'light' });
    });

    it('returns custom light color when provided', () => {
      const result = useThemeColor({ light: '#FF0000' }, 'text');
      expect(result).toBe('#FF0000');
    });

    it('returns custom dark color when provided', () => {
      mockUseTheme.mockReturnValue({ themeMode: 'dark' });
      const result = useThemeColor({ dark: '#00FF00' }, 'text');
      expect(result).toBe('#00FF00');
    });

    it('returns custom light color when both light and dark provided but theme is light', () => {
      const result = useThemeColor({ light: '#FF0000', dark: '#00FF00' }, 'text');
      expect(result).toBe('#FF0000');
    });

    it('returns custom dark color when both light and dark provided but theme is dark', () => {
      mockUseTheme.mockReturnValue({ themeMode: 'dark' });
      const result = useThemeColor({ light: '#FF0000', dark: '#00FF00' }, 'text');
      expect(result).toBe('#00FF00');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({ themeMode: 'light' });
    });

    it('handles empty props object', () => {
      const result = useThemeColor({}, 'text');
      expect(result).toBe('#000000');
    });

    it('handles undefined props', () => {
      const result = useThemeColor({ light: undefined, dark: undefined }, 'text');
      expect(result).toBe('#000000');
    });
  });

  describe('Theme Context Integration', () => {
    it('calls useTheme hook', () => {
      mockUseTheme.mockReturnValue({ themeMode: 'light' });
      
      useThemeColor({}, 'text');
      
      expect(mockUseTheme).toHaveBeenCalledTimes(1);
    });

    it('uses themeMode from context', () => {
      mockUseTheme.mockReturnValue({ themeMode: 'dark' });
      
      const result = useThemeColor({}, 'text');
      
      expect(result).toBe('#FFFFFF');
    });
  });
});
