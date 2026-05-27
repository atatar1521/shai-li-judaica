/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: 'browser',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/src/components/**/*.test.tsx',
        '<rootDir>/src/app/admin/__tests__/*.test.tsx',
        '<rootDir>/src/app/admin/products/__tests__/*.test.tsx',
        '<rootDir>/src/app/auth/login/__tests__/*.test.tsx',
        '<rootDir>/src/app/__tests__/*.test.tsx',
      ],
      transform: {
        '^.+\\.(ts|tsx)$': ['@swc/jest', {
          jsc: {
            transform: {
              react: { runtime: 'automatic' },
            },
          },
        }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.css$': '<rootDir>/src/__mocks__/fileMock.js',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    },
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/src/lib/__tests__/*.test.ts',
        '<rootDir>/src/lib/supabase/__tests__/*.test.ts',
        '<rootDir>/src/app/api/**/__tests__/*.test.ts',
        '<rootDir>/src/app/auth/callback/__tests__/*.test.ts',
        '<rootDir>/src/__tests__/proxy.test.ts',
      ],
      transform: {
        '^.+\\.ts$': ['@swc/jest', {}],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  ],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/app/globals.css',
  ],
  coverageThreshold: {
    global: {
      lines: 90,
      functions: 65,
      branches: 85,
      statements: 90,
    },
  },
}

module.exports = config
