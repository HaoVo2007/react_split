/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables
 * 
 * All environment variables must be prefixed with VITE_
 * to be accessible in the client-side code.
 */

interface ImportMetaEnv {
  /** API Base URL */
  readonly VITE_API_URL: string
  
  /** Application Name */
  readonly VITE_APP_NAME: string
  
  /** Environment (local, development, production, test) */
  readonly VITE_APP_ENV: string
  
  /** Enable debug mode */
  readonly VITE_ENABLE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
