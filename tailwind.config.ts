import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-dm-sans)', 'sans-serif'],
        script: ['var(--font-nothing-you-could-do)', 'cursive'],
      },
      colors: {
        accent: '#8CB1DE',
        lime: '#ccff00',
      },
    },
  },
  plugins: [],
}
export default config

