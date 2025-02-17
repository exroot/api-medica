// Jest Configuration
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1", // Añadimos el alias para @config
    "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1", // Añadimos el alias para @config
    "^@utils/(.*)$": "<rootDir>/src/utils/$1", // Añadimos el alias para @config
  },
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json", // Usa el tsconfig principal
    },
  },
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
