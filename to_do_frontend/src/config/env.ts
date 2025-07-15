/**
 * Environment configuration with type safety and validation.
 * Provides centralized access to environment variables.
 */

interface Environment {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
  IS_TEST: boolean;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return parsed;
};

export const env: Environment = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:9090'),
  API_TIMEOUT: getEnvNumber('VITE_API_TIMEOUT', 10000),
  NODE_ENV: (import.meta.env.NODE_ENV as Environment['NODE_ENV']) || 'development',
  IS_DEVELOPMENT: import.meta.env.NODE_ENV === 'development',
  IS_PRODUCTION: import.meta.env.NODE_ENV === 'production',
  IS_TEST: import.meta.env.NODE_ENV === 'test',
};

// Validate required environment variables on app start
if (env.IS_PRODUCTION && !import.meta.env.VITE_API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required in production');
}

export default env;
