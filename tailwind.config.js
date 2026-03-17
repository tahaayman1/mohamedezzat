export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#000000',
          raised: '#060606',
          card: '#0a0a0a',
          hover: '#0f0f0f',
          lighter: '#141414',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'mesh-move': 'meshMove 20s ease-in-out infinite',
        'mesh-move-2': 'meshMove2 25s ease-in-out infinite',
        'mesh-move-3': 'meshMove3 30s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        meshMove: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '25%': { transform: 'translate(10%, -15%) scale(1.1)' },
          '50%': { transform: 'translate(-5%, 10%) scale(0.95)' },
          '75%': { transform: 'translate(-10%, -5%) scale(1.05)' },
        },
        meshMove2: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '25%': { transform: 'translate(-15%, 10%) scale(1.05)' },
          '50%': { transform: 'translate(10%, -10%) scale(1.1)' },
          '75%': { transform: 'translate(5%, 15%) scale(0.95)' },
        },
        meshMove3: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1.05)' },
          '25%': { transform: 'translate(15%, 5%) scale(0.95)' },
          '50%': { transform: 'translate(-10%, -15%) scale(1.1)' },
          '75%': { transform: 'translate(-5%, 10%) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
