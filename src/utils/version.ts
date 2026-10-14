// Single source of truth for the app version shown in the UI.
// Vite exposes named exports for JSON imports, so only `version` is
// bundled, not the whole package.json.
import { version } from "../../package.json"

export const APP_VERSION: string = version
