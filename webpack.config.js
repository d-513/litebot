const path = require("path");

module.exports = {
  entry: "./public/src/app.js",
  output: {
    filename: "dist/0.js",
    path: path.resolve(__dirname, "public"),
  },
};
