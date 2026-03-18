/**
 * Environment Configuration
 * 
 * Centralized access to environment variables with type safety and defaults.
 * All environment variables in Vite must be prefixed with VITE_
 */

// Type definition for environment variables
interface EnvConfig {
  // API Configuration
  API_URL: string
  
  // Frontend Configuration
  FE_DOMAIN: string
  
  // App Configuration
  APP_NAME: string
  APP_ENV: 'local' | 'production' | 'development' | 'test'
  
  // Feature Flags
  ENABLE_DEBUG: boolean
  IS_PRODUCTION: boolean
  IS_LOCAL: boolean
}

/**
 * Get environment variable with type safety
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key]
  if (value === undefined || value === null || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    console.warn(`Environment variable ${key} is not defined`)
    return ''
  }
  return String(value)
}

/**
 * Parse boolean from environment variable
 */
function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key)
  if (value === '') return defaultValue
  return value === 'true' || value === '1'
}

// Export environment configuration
export const env: EnvConfig = {
  // API Configuration
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:8080/api/v1'),
  
  // Frontend Configuration
  FE_DOMAIN: getEnvVar('VITE_FE_DOMAIN', 'http://localhost:5173'),
  
  // App Configuration
  APP_NAME: getEnvVar('VITE_APP_NAME', 'TravelSplit'),
  APP_ENV: getEnvVar('VITE_APP_ENV', 'local') as EnvConfig['APP_ENV'],
  
  // Feature Flags
  ENABLE_DEBUG: getEnvBool('VITE_ENABLE_DEBUG', true),
  IS_PRODUCTION: getEnvVar('VITE_APP_ENV') === 'production',
  IS_LOCAL: getEnvVar('VITE_APP_ENV', 'local') === 'local',
}

// Export individual values for convenience
export const API_URL = env.API_URL
export const FE_DOMAIN = env.FE_DOMAIN
export const APP_NAME = env.APP_NAME
export const APP_ENV = env.APP_ENV
export const ENABLE_DEBUG = env.ENABLE_DEBUG
export const IS_PRODUCTION = env.IS_PRODUCTION
export const IS_LOCAL = env.IS_LOCAL

// API endpoints builder
export const apiEndpoints = {
  // Auth
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  logout: `${API_URL}/auth/logout`,
  refresh: `${API_URL}/auth/refresh`,
  
  // Users
  profile: `${API_URL}/users/profile`,
  updateProfile: `${API_URL}/users/profile`,
  
  // Groups
  groups: `${API_URL}/groups`,
  group: (id: string) => `${API_URL}/groups/${id}`,
  groupMembers: (id: string) => `${API_URL}/groups/${id}/members`,
  addGroupMember: (id: string) => `${API_URL}/groups/${id}/members`,
  
  // Expenses
  expenses: `${API_URL}/expenses`,
  expense: (id: string) => `${API_URL}/expenses/${id}`,
  expensesByGroup: (groupId: string) => `${API_URL}/expenses/group/${groupId}`,
  expenseSettlement: (id: string) => `${API_URL}/expenses/${id}/settlement`,
  groupBalance: (groupId: string) => `${API_URL}/expenses/group/${groupId}/balance`,
} as const

// Log configuration in non-production environments
if (ENABLE_DEBUG) {
  console.log('🌍 Environment Configuration:', {
    API_URL: env.API_URL,
    APP_ENV: env.APP_ENV,
    IS_PRODUCTION: env.IS_PRODUCTION,
  })
}
