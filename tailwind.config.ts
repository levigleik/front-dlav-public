import type { Config } from 'tailwindcss'

import { nextui } from '@nextui-org/react'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        main: '#0388a6',
        'main-200': '#0396a6',
        'main-300': '#03a6a6',
        'main-white': '#b6f2f2',
        'main-green': '#038c65',
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      keyframes: {
        rotate: {
          '100%': {
            transform: 'rotate(1turn)',
          },
        },
      },
    },
    screens: {
      '4xs': '340px',
      '3xs': '380px',
      '2xs': '400px',
      xs: '480px',
      sm: '640px',
      md: '768px',
      mdlg: '900px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1680px',
      '4xl': '1920px',
      '5xl': '2320px',
      '6xl': '2560px',
    },
  },
  darkMode: 'class',
  plugins: [
    require('tailwind-scrollbar'),
    nextui({
      prefix: 'nextui',
      addCommonColors: true,
      layout: {},

      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#0388a6',
              foreground: '#000000',
            },
            focus: '#0388a6',
          },
          layout: {},
        },
        dark: {
          layout: {},
          colors: {
            primary: {
              DEFAULT: '#0388a6',
              foreground: '#000000',
            },
            focus: '#0388a6',
          },
        },
      },
    }),
  ],
}
export default config
