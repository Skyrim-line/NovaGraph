module.exports = {
    // Tell Jest to handle WASM modules
    transformIgnorePatterns: ["node_modules/(?!kuzu-wasm)/"],
    
    // Setup test environment
    testEnvironment: "jsdom",
    
    // Setup files that run before tests
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js'
    ],
    
    // Mock path configurations
    moduleNameMapper: {
      // Mock WASM modules
      '^kuzu-wasm/sync$': '<rootDir>/tests/__mocks__/kuzu-wasm.js',
    },
    transform: {
        '^.+\\.[t|j]sx?$': 'babel-jest'
    }
  };