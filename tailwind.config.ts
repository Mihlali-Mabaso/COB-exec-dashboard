import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { ink: '#17251f', forest: '#173f32', moss: '#66816c', lime: '#d8f06b', paper: '#f5f6f2' }, boxShadow: { soft: '0 12px 36px rgba(23,37,31,.07)' } } },
  plugins: [],
};
export default config;
