const tintColorLight = '#0891B2';
const tintColorDark = '#22D3EE';

const colorScheme = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    tint: tintColorLight,
    primary: '#0891B2',
    secondary: '#F59E0B',
    accent: '#EC4899',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    gray: '#94A3B8',
    icon: '#64748B',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0F172A',
    surface: '#1E293B',
    tint: tintColorDark,
    primary: '#22D3EE',
    secondary: '#FBBF24',
    accent: '#F472B6',
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    gray: '#64748B',
    icon: '#94A3B8',
    border: '#334155',
    borderLight: '#1E293B',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export default colorScheme;

export const colors = colorScheme.light;
