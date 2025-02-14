// Jest Configuration
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json", // Usa el tsconfig principal
    },
  },
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
