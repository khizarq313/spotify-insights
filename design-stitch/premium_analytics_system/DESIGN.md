---
name: Premium Analytics System
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e17'
  surface-container-low: '#171c25'
  surface-container: '#1b2029'
  surface-container-high: '#262a34'
  surface-container-highest: '#31353f'
  on-surface: '#dfe2f0'
  on-surface-variant: '#bbcbb8'
  inverse-surface: '#dfe2f0'
  inverse-on-surface: '#2c303b'
  outline: '#859583'
  outline-variant: '#3c4a3c'
  surface-tint: '#34e36a'
  primary: '#4cf479'
  on-primary: '#003913'
  primary-container: '#1ed760'
  on-primary-container: '#005721'
  inverse-primary: '#006e2c'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#7ee5ff'
  on-tertiary: '#003640'
  tertiary-container: '#3bcbea'
  on-tertiary-container: '#005261'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#69ff89'
  primary-fixed-dim: '#34e36a'
  on-primary-fixed: '#002108'
  on-primary-fixed-variant: '#00531f'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0f131d'
  on-background: '#dfe2f0'
  surface-variant: '#31353f'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  stat-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: -0.02em
  stat-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 32px
  gutter: 24px
  section-gap: 64px
  component-padding-x: 20px
  component-padding-y: 12px
---

## Brand & Style

The design system is engineered for a high-fidelity, data-rich experience that feels both professional and celebratory. It targets power users, artists, and data enthusiasts who require deep technical insights without sacrificing the emotive energy of music. 

The aesthetic is a sophisticated hybrid of **Glassmorphism** and **High-Contrast Modernism**. It leverages the structural precision of Linear and Vercel—characterized by subtle borders and refined spacing—while injecting the vibrant, kinetic energy of Spotify Wrapped through rich layered gradients and neon glows. The interface should feel like a premium command center: dark, immersive, and highly polished.

Key visual pillars include:
- **Depth through Translucency:** Layered surfaces that use backdrop blurs to maintain context.
- **Luminous Data:** Metrics and charts that emit "light" against the dark canvas.
- **Atmospheric Texture:** Subtle film grain and grid overlays to prevent flat digital fatigue.

## Colors

This design system utilizes a deep, multi-layered dark palette to create a sense of infinite depth. The primary background is nearly black, providing a high-contrast foundation for vibrant accents.

- **Background Strategy:** Use `#070B14` for the lowest level (app frame). Transition to `#0B1120` and `#111827` for content containers to create a natural hierarchy of information.
- **Accent Logic:** 
    - **Spotify Green** is reserved for primary actions and "success" states.
    - **Electric Purple** and **Cyan** are used for secondary data streams and categorical differentiation.
    - **Hot Pink** serves as a tertiary highlight for trending or high-intensity metrics.
- **Glass Effects:** Surfaces use `#161F33` at 60-80% opacity with a `24px` backdrop blur and a `1px` white border at 10% opacity.

## Typography

Typography is used to balance modern SaaS utility with editorial flair. 

- **Display & Headings:** Use **Geist** with tight letter-spacing for a "tech-forward" look. Display sizes should leverage bold weights to create clear entry points in data-heavy screens.
- **Data & Stats:** All numerical data and technical metrics must use **JetBrains Mono**. This creates a visual distinction between narrative content and analytical content, ensuring numbers are easy to scan and compare.
- **Readability:** Body text uses a generous line-height to maintain legibility against the dark background. Use the "Muted" text color for long-form descriptions to reduce eye strain.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with strict adherence to a 4px baseline unit. 

- **Grid System:** A 12-column grid is used for desktop views. Large analytics dashboards should utilize "Bento-box" style layouts where cards span multiple columns and rows to create a dynamic, masonry-like feel.
- **Rhythm:** Use large margins (32px+) on the outer edges of the viewport to maintain a premium, spacious feel. Gutters should remain consistent at 24px to allow the glassmorphic borders enough room to breathe without visual clutter.
- **Padding:** Internal card padding should be generous (24px to 32px) to ensure that dense charts do not feel cramped.

## Elevation & Depth

Elevation in this system is communicated via **Tonal Layering** and **Luminescence** rather than traditional shadows.

- **Base Layer:** The deepest `#070B14` layer serves as the "void."
- **Interactive Surfaces:** Cards and modals use backdrop blurs (20px-40px) and a `1px` inner stroke of `rgba(255, 255, 255, 0.1)`. This simulates a sheet of glass floating in space.
- **Glows:** High-priority elements (like an active "Now Playing" or a peak metric) use an "Ambient Glow." This is a drop shadow with a large blur radius (30px-60px), low opacity (20%), and a color tint matching the element's primary accent (e.g., a Green glow for a Green button).
- **Texture:** Apply a very subtle noise texture (opacity 0.03) to the entire background to give the gradients a tactile, film-like quality.

## Shapes

The shape language is friendly yet structured, leaning heavily into high-radius curves to mirror the organic nature of music.

- **Containers:** Main dashboard cards and content containers use a `24px` radius.
- **Interactive Elements:** Buttons and input fields use an `18px` radius to feel distinct from larger structural containers.
- **Search & Filter:** Search bars and utility buttons should utilize "Pill" shapes (full rounding) to indicate their function as global tools.
- **Charts:** Bar charts and progress indicators should have fully rounded caps to maintain the "soft" technical aesthetic.

## Components

### Buttons
- **Primary:** Spotify Green background, black text, no border. On hover, add a 15px Green outer glow.
- **Secondary:** Transparent background, 1px white (20% opacity) border. On hover, background fills to 10% white.
- **Glass Action:** Background `#1B2540` at 50% opacity, 20px blur, white text.

### Cards
- **Analytics Card:** Background `#161F33` (70% opacity), 1px stroke, 24px corner radius. Header text in `label-caps`. 
- **Hover State:** Increase border opacity to 30% and add a subtle vertical gradient shift.

### Data Visualization
- **Line Charts:** Use thick 3px lines with a vertical gradient fill (accent color to transparent).
- **Glow Points:** Data points on hover should emit a small neon pulse of the corresponding accent color.

### Inputs
- **Text Fields:** Subtle dark fill (`#0B1120`), 1px border. Focus state changes border to Spotify Green with a 4px soft outer glow.
- **Chips/Filters:** Pill-shaped, semi-transparent. Active state uses a solid accent color gradient (e.g., Purple to Cyan).

### Navigation
- **Sidebar:** Fixed position, `#070B14` background, separated from the main content by a single 1px vertical line. Use icons with a "Duotone" style, where the secondary path is 40% opacity.