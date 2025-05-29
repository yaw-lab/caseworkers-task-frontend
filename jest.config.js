// jest.config.js
module.exports = {
  
    transformIgnorePatterns: [
      '/node_modules/(?!(react-native|@react-native|@rneui|@testing-library|jest-expo|expo|axios)/)',
    ],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], 
  };