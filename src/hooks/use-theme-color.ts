import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { themeMode } = useTheme();
  const colorFromProps = props[themeMode];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    const color = Colors[themeMode][colorName];
    console.log(`useThemeColor: ${colorName} for ${themeMode} = ${color}`);
    return color;
  }
}
