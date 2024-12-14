module.exports = {
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  
  moduleNameMapper: {
    "^/src/(.*)": "<rootDir>/src/$1", 
    "^src/(.*)$": "<rootDir>/frontend/src/$1", 
    "\\.css$": "identity-obj-proxy", 
    "\\.module\\.css$": "identity-obj-proxy", 
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.js',
    "\\.(css|less|scss|sass)$": "<rootDir>/test/__mocks__/styleMock.js"
  },

  transformIgnorePatterns: [
    "/node_modules/(?!swiper|some-other-module-to-transform)/",
  ],

  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|svg)$": "jest-transform-stub",
    "^.+\\.css$": "jest-transform-css",
  },

  testEnvironment: "jsdom",

  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
};
