import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { ConfigProvider, theme as antdTheme } from "antd"
import themeJson from "../assets/theme.json"

export type ThemeMode = "dark" | "light"

/**
 * Only the Home page (`/`) lets the user toggle between dark and light;
 * the label-tool and visualization pages are pinned to light by design
 * (they're rendered on top of light images / charts that don't read well
 * against a dark chrome).
 */
export type ThemeScope = "home" | "pinnedLight"

const STORAGE_KEY = "swimchrono.theme.home"

function scopeFor(pathname: string): ThemeScope {
  // Anything that isn't the Home root is pinned.
  return pathname === "/" || pathname === "" ? "home" : "pinnedLight"
}

function readStoredHome(): ThemeMode | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark") return stored
  } catch {
    // ignore
  }
  return undefined
}

function writeStoredHome(mode: ThemeMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // ignore (Safari private mode etc.)
  }
}

interface ThemeContextValue {
  mode: ThemeMode
  scope: ThemeScope
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const Ctx = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const scope = scopeFor(location.pathname)

  // Home page reads/writes its own preference; other pages are forced
  // to "light" regardless of what the home page may have stored.
  const [homeMode, setHomeMode] = useState<ThemeMode>(
    () => readStoredHome() ?? "dark"
  )

  const mode: ThemeMode = scope === "home" ? homeMode : "light"

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode)
  }, [mode])

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    scope,
    setMode(newMode) {
      if (scope !== "home") return
      setHomeMode(newMode)
      writeStoredHome(newMode)
    },
    toggle() {
      if (scope !== "home") return
      const next: ThemeMode = homeMode === "dark" ? "light" : "dark"
      setHomeMode(next)
      writeStoredHome(next)
    },
  }), [mode, scope, homeMode])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(Ctx)
  if (!ctx) {
    // Tests render components outside ThemeProvider; fall back to dark
    // so existing snapshot-style tests keep their previous palette.
    return { mode: "dark", scope: "home", setMode: () => {}, toggle: () => {} }
  }
  return ctx
}

/**
 * Mode-dependent palette for nodes that are rendered through Konva /
 * inline SVG and therefore can't read CSS variables. Keep in sync with
 * the --background-color / --text-color* / --border-color-soft etc.
 * declared in src/index.css.
 */
export const themePalette = {
  dark: {
    background: "#1a1a1a",
    backgroundElevated: "#222222",
    backgroundPreStart: "#222222",
    backgroundPreStartInvisible: "#1d1d1d",
    text: "#B0B0B0",
    textBright: "#dedede",
    borderSoft: "#454545",
    legendStroke: "#dedede",
    legendOverlayBg: "#1a1a1a",
    // Per-layer timeline bar.
    layerBarFill: "#616161",
    layerBarFillInvisible: "#303030",
    layerRowSelected: "#1e5874",
    layerRowSelectedInvisible: "#1b2c35",
  },
  light: {
    background: "#ffffff",
    backgroundElevated: "#f5f5f5",
    backgroundPreStart: "#ececec",
    backgroundPreStartInvisible: "#f6f6f6",
    text: "#333333",
    textBright: "#1a1a1a",
    borderSoft: "#d9d9d9",
    legendStroke: "#333333",
    legendOverlayBg: "#ffffff",
    // Per-layer timeline bar — antd-flavoured greys & primary-tinted
    // selected row.
    layerBarFill: "#bfbfbf",
    layerBarFillInvisible: "#e6e6e6",
    layerRowSelected: "#bae0ff",
    layerRowSelectedInvisible: "#e6f4ff",
  },
} as const

export type ThemeColors = typeof themePalette[ThemeMode]

export function useThemeColors(): ThemeColors {
  const { mode } = useTheme()
  return themePalette[mode]
}

/**
 * Wraps children in an antd ConfigProvider whose algorithm follows the
 * current ThemeMode. Must be rendered inside <ThemeProvider>.
 */
export function ThemedAntdProvider({ children }: { children: ReactNode }) {
  const { mode } = useTheme()
  const algorithm = mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm

  // themeJson hard-codes \`colorTextBase: "#dedede"\` (light grey, only
  // makes sense over a dark surface). Strip it in light mode so antd's
  // defaultAlgorithm can derive a readable dark-on-white text colour.
  const baseTokens = themeJson.token ?? {}
  const tokenForMode = mode === "dark"
    ? baseTokens
    : Object.fromEntries(
        Object.entries(baseTokens).filter(([key]) => key !== "colorTextBase")
      )

  // antd's Tooltip uses a near-black "spotlight" surface in both
  // algorithms. In light mode that clashes with the rest of the chrome,
  // so override the Tooltip-specific tokens to give it a light surface.
  const baseComponents = (themeJson as { components?: Record<string, unknown> }).components ?? {}
  const componentsForMode = mode === "dark"
    ? baseComponents
    : {
        ...baseComponents,
        Tooltip: {
          ...((baseComponents as Record<string, unknown>).Tooltip ?? {}),
          colorBgSpotlight: "#ffffff",
          colorTextLightSolid: "#1a1a1a",
        },
      }

  // Shrink the global antd font size from the default 14 → 13. Brings
  // helper labels ("Visibility:", "Size:" etc.) and antd-rendered chrome
  // (button labels, select options) down a notch to match the trimmed
  // section headers.
  const tokenWithFontSize = { fontSize: 13, ...tokenForMode }

  return (
    <ConfigProvider
      componentSize="small"
      theme={{ ...themeJson, token: tokenWithFontSize, components: componentsForMode, algorithm }}
    >
      {children}
    </ConfigProvider>
  )
}
