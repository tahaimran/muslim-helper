module.exports = {
  preset: 'jest-expo',
  globalSetup: './jest.global-setup.js',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
};
