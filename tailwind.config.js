// See https://tailwindcss.com/docs/configuration
module.exports = {
  purge: ["./src/**/*.js"],
  // https://github.com/tailwindlabs/tailwindcss-forms
  plugins: [require("@tailwindcss/forms")],
  theme: {
    colors: {
      white: '#fff',
      dark: {
        100: '#0B132B',
        200: '#1C2541',
        300: '#3A506B',
        400: '#f5f5f5'
      },
      primary: {
        100: '#42BFDD',
        200: '#0CD15B',
      },
    },
    fontFamily: {
      sans: ['Noto Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
    },
    extend: {
      fontSize: {
        jumbo: '72px',
      }
    }
  }
};
