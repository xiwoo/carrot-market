module.exports = {
  content: [
    "./pages/**/*.tsx", 
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  // darkMode: "class",//기존 브라우저 설정을 따라가지 않는다.
  darkMode: "media",//기존 브라우저 설정을 따라간다.
  plugins: [],
}
