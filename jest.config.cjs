module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
  ],
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.js"],
  testMatch: [
    "**/__tests__/**/*.js?(x)",
    "**/?(*.)+(spec|test).js?(x)",
  ],
};
