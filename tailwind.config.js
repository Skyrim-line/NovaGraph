/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 监控 src 文件夹
    "./public/index.html", // 监控 HTML 文件
  ],

  theme: {
    extend: {
      fontFamily: {
        eras: ['"ITC Eras Book"', "sans-serif"], // 定义字体
      },
    },
  },
  darkMode: "class",
  plugins: [], // 在这里使用插件
};
