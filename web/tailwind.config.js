/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 品牌色 - 主色调
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // 主色
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // 中性色
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // 语义色
        semantic: {
          success: {
            light: '#dcfce7',
            DEFAULT: '#22c55e',
            dark: '#16a34a',
          },
          error: {
            light: '#fee2e2',
            DEFAULT: '#ef4444',
            dark: '#dc2626',
          },
          warning: {
            light: '#fef3c7',
            DEFAULT: '#f59e0b',
            dark: '#d97706',
          },
          info: {
            light: '#dbeafe',
            DEFAULT: '#3b82f6',
            dark: '#2563eb',
          },
        },
      },
    },
  },
  plugins: [],
}