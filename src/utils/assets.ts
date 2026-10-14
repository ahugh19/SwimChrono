// Resolve a public asset path (video/…, csv/…, configuration/…) against
// VITE_ASSET_BASE_URL. When the variable is empty the path is returned
// unchanged and resolves relative to <base href>, i.e. the files are
// served from public/ as before. Setting it lets the large videos and
// CSVs live on a CDN / object storage instead of the git repository.

function readAssetBase(): string {
  const env = (typeof import.meta !== "undefined" ? import.meta.env : undefined) as
    | Record<string, string | undefined>
    | undefined
  const value = env?.VITE_ASSET_BASE_URL
  return value && value !== "" ? value.replace(/\/+$/, "") : ""
}

export const assetBaseUrl: string = readAssetBase()

export function assetUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("blob:")) return path
  const clean = path.replace(/^\/+/, "")
  return assetBaseUrl ? `${assetBaseUrl}/${clean}` : clean
}
