// Centralised AI assistant configuration for the TriggerDrawer.
//
// Reads from Vite's `import.meta.env` (variables prefixed with VITE_ are
// exposed to the front-end bundle). All values are optional so the app can
// still load when the key isn't configured; callers should check
// `aiConfig.isConfigured` before issuing requests.

export interface AiConfig {
  provider: string
  baseURL: string
  apiKey: string
  model: string
  isConfigured: boolean
}

const DEFAULT_BASE_URL = "https://api.deepseek.com"
const DEFAULT_MODEL = "deepseek-chat"
const DEFAULT_PROVIDER = "openai-compatible"

function readEnv(name: string): string | undefined {
  const env = (typeof import.meta !== "undefined" ? import.meta.env : undefined) as
    | Record<string, string | undefined>
    | undefined
  const value = env?.[name]
  return value && value !== "" ? value : undefined
}

export function loadAiConfig(): AiConfig {
  const apiKey = readEnv("VITE_AI_API_KEY") ?? ""
  return {
    provider: readEnv("VITE_AI_PROVIDER") ?? DEFAULT_PROVIDER,
    baseURL: readEnv("VITE_AI_BASE_URL") ?? DEFAULT_BASE_URL,
    apiKey,
    model: readEnv("VITE_AI_MODEL") ?? DEFAULT_MODEL,
    isConfigured: apiKey.length > 0,
  }
}

export const aiConfig: AiConfig = loadAiConfig()

// Optional backend URL for the legacy label-tool persistence API.
// Empty string disables backend calls; the demo runs without it.
export const backendApiUrl: string =
  readEnv("VITE_BACKEND_API_URL") ?? ""

