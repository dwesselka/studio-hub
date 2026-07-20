import { useEffect } from 'react'
import { useWorkspace } from './WorkspaceProvider.tsx'

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Conversão básica
  let r = 0,
    g = 0,
    b = 0
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16)
    g = parseInt(hex[3] + hex[4], 16)
    b = parseInt(hex[5] + hex[6], 16)
  }
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function useBranding() {
  const { workspace } = useWorkspace()

  useEffect(() => {
    if (!workspace) return

    const root = document.documentElement
    const { primaryColor, secondaryColor, accentColor, favicon, name } = workspace

    // Injeta CSS variables do workspace se existirem
    if (primaryColor) {
      root.style.setProperty('--brand-primary', primaryColor)
      const hsl = hexToHSL(primaryColor)
      root.style.setProperty('--brand-primary-h', `${hsl.h}`)
      root.style.setProperty('--brand-primary-s', `${hsl.s}%`)
      root.style.setProperty('--brand-primary-l', `${hsl.l}%`)
    }

    if (secondaryColor) root.style.setProperty('--brand-secondary', secondaryColor)
    if (accentColor) root.style.setProperty('--brand-accent', accentColor)

    // Favicon dinâmico
    if (favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = favicon
    }

    // Title dinâmico
    if (name) {
      document.title = `${name} | StudioHub`
    }

    return () => {
      root.style.removeProperty('--brand-primary')
      root.style.removeProperty('--brand-secondary')
      root.style.removeProperty('--brand-accent')
      root.style.removeProperty('--brand-primary-h')
      root.style.removeProperty('--brand-primary-s')
      root.style.removeProperty('--brand-primary-l')
    }
  }, [workspace])
}
