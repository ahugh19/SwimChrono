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
  // Blue-tinted neutrals; keep in sync with the CSS variables in index.css.
  dark: {
    background: "#161a1f",
    backgroundElevated: "#1e242b",
    backgroundPreStart: "#1b2128",
    backgroundPreStartInvisible: "#181d23",
    text: "#b8c2cc",
    textBright: "#e8eef3",
    borderSoft: "#2f3a45",
    legendStroke: "#e8eef3",
    legendOverlayBg: "#161a1f",
    // Per-layer timeline bar.
    layerBarFill: "#5b6b7a",
    layerBarFillInvisible: "#303a44",
    // Selected row: a deep blue tint, dark enough that the bright link
    // icons (and their hover state) stay readable on top of it.
    layerRowSelected: "#1c3b53",
    layerRowSelectedInvisible: "#182b3b",
    rowHover: "#222a33",
    // Accent used for playheads, handles and selection strokes.
    accent: "#2babea",
    accentSoft: "rgba(43, 171, 234, 0.18)",
  },
  light: {
    background: "#ffffff",
    backgroundElevated: "#f3f6f9",
    backgroundPreStart: "#e8eef3",
    backgroundPreStartInvisible: "#f3f6f9",
    text: "#3b4a59",
    textBright: "#14202c",
    borderSoft: "#d5dde5",
    legendStroke: "#3b4a59",
    legendOverlayBg: "#ffffff",
    // Per-layer timeline bar.
    layerBarFill: "#a9b8c6",
    layerBarFillInvisible: "#dfe6ec",
    // Light mode needs a deeper blue: #2babea is too pale on white.
    layerRowSelected: "#cfe4f5",
    layerRowSelectedInvisible: "#e4f0f9",
    rowHover: "#eef3f7",
    accent: "#1a8fc7",
    accentSoft: "rgba(26, 143, 199, 0.16)",
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
  // Link-styled buttons (layer row icons) sit on tinted selected rows: use
  // a lighter blue in dark mode and a deeper blue in light mode so both the
  // resting and hover states keep contrast against the row background.
  const modeTokens = mode === "dark"
    ? {
        colorBgBase: themePalette.dark.background,
        colorBgContainer: themePalette.dark.backgroundElevated,
        colorBgElevated: themePalette.dark.backgroundElevated,
        colorBorder: themePalette.dark.borderSoft,
        colorBorderSecondary: themePalette.dark.borderSoft,
        colorPrimary: "#2babea",
        colorLink: "#4fc0f0",
        colorLinkHover: "#9adcf8",
        colorLinkActive: "#2babea",
      }
    : {
        colorBgBase: themePalette.light.background,
        colorBgContainer: themePalette.light.background,
        colorBgElevated: themePalette.light.background,
        colorBorder: themePalette.light.borderSoft,
        colorBorderSecondary: themePalette.light.borderSoft,
        colorTextBase: themePalette.light.textBright,
        colorPrimary: "#1a8fc7",
        colorInfo: "#1a8fc7",
        colorLink: "#1a8fc7",
        colorLinkHover: "#0d6fa0",
        colorLinkActive: "#136f9c",
      }
  const tokenWithFontSize = { fontSize: 13, ...tokenForMode, ...modeTokens }

  return (
    <ConfigProvider
      componentSize="small"
      theme={{ ...themeJson, token: tokenWithFontSize, components: componentsForMode, algorithm }}
    >
      {children}
    </ConfigProvider>
  )
}
