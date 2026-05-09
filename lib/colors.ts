/**
 * Centralized color configuration for Spotify Insights
 * This is the SINGLE SOURCE OF TRUTH for brand colors
 */

export const colors = {
  // Primary brand color - Spotify green
  primary: '#1DB954',

  // Derived shades
  primaryLight: '#1ed760',
  primaryLighter: '#3be377',
  primaryDark: '#148a3d',
} as const

// OKLCH equivalents (copy these to globals.css if you change the hex above)
// primary:        oklch(0.69 0.20 148)
// primaryLight:   oklch(0.75 0.20 148)
// primaryLighter: oklch(0.81 0.18 148)
// primaryDark:    oklch(0.54 0.18 148)
