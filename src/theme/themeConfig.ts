import type { ThemeConfig } from 'antd';

const baseTheme = {
  token: {
    borderRadius: 12,
    colorPrimary: '#FF3CAC',
    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

const gradientBg = {
  light: 'linear-gradient(45deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)',
  dark: 'linear-gradient(45deg, #434343 0%, #000000 100%)',
};

export const lightTheme: ThemeConfig = {
  ...baseTheme,
  token: {
    ...baseTheme.token,
    colorBgContainer: '#FFFFFF',
    colorText: '#000000',
    colorTextSecondary: 'rgba(0, 0, 0, 0.6)',
    colorBorder: 'rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme: ThemeConfig = {
  ...baseTheme,
  token: {
    ...baseTheme.token,
    colorBgContainer: '#1A1B1F',
    colorText: '#FFFFFF',
    colorTextSecondary: 'rgba(255, 255, 255, 0.6)',
    colorBorder: 'rgba(255, 255, 255, 0.1)',
  },
};

export { gradientBg }; 