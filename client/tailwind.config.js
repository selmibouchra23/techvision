/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#010851",
        'secondary':"9A7AF1",
        'tartiary':"#070707",
        "pink":"#EE9ES",



        'blue':"#534ecc",
        'blue-google':"#4285f4",
        'blue-50': "#eff6ff", 
        'blue-100': "#dbeafe",
        'blue-200': "#bfdbfe",
        'blue-500': "#3B82F6",
        'blue-600': "#2563eb",
        'blue-800': "#1e40af",
        'blue-900': "#1e3a8a",
        'gray-100': "#f3f4f6",

        
        'yallow' : "#ffe461",
      },

    },
  },
  plugins: [],
}

