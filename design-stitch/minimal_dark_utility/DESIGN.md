---
name: Minimal Dark Utility
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1b1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#bbcbb8'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#859583'
  outline-variant: '#3c4a3c'
  surface-tint: '#34e36a'
  primary: '#4cf479'
  on-primary: '#003913'
  primary-container: '#1ed760'
  on-primary-container: '#005721'
  inverse-primary: '#006e2c'
  secondary: '#c3c6d4'
  on-secondary: '#2c303b'
  secondary-container: '#454954'
  on-secondary-container: '#b5b8c6'
  tertiary: '#ffccbb'
  on-tertiary: '#571f08'
  tertiary-container: '#ffa585'
  on-tertiary-container: '#793820'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#69ff89'
  primary-fixed-dim: '#34e36a'
  on-primary-fixed: '#002108'
  on-primary-fixed-variant: '#00531f'
  secondary-fixed: '#dfe2f0'
  secondary-fixed-dim: '#c3c6d4'
  on-secondary-fixed: '#171b25'
  on-secondary-fixed-variant: '#434752'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#73341c'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  h1:
    fontFamily: Geist Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Geist Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: '0'
  body-lg:
    fontFamily: Geist Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Geist Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-label:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: '0'
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system is rooted in a **Minimalist, High-Contrast SaaS** aesthetic. It prioritizes information density and technical precision over decorative flourishes. The brand personality is utilitarian, developer-centric, and focused, echoing the efficiency of high-end productivity tools and command-line interfaces.

Key principles:
- **Absolute Flatness:** No gradients, box-shadows, or blurs. Depth is communicated strictly through tonal shifts and solid borders.
- **Utility-First:** Every element serves a functional purpose. Whitespace is used to group related information, not just for aesthetic breathing room.
- **Digital Brutalism Lite:** Sharp edges and high-contrast lines create a structured, "engineered" feel without the intentional "ugliness" of traditional brutalism.

## Colors

The palette is strictly limited to ensure high legibility and focus. 

- **Backgrounds:** Use `#0F131D` for the global canvas and `#171C25` for surface elements like cards, sidebars, and modals.
- **Accent:** `#1ED760` is reserved exclusively for primary calls to action, active states, and success indicators. Use it sparingly to maintain its impact.
- **Borders:** A single, consistent color `#353944` is used for all structural lines, dividers, and component outlines.
- **Text:** Pure white `#FFFFFF` for primary content and headings. Mid-range grays are used for secondary metadata to create a clear visual hierarchy.

## Typography

This design system utilizes **Geist Sans** for all UI elements, capitalizing on its geometric precision and readability in dark environments. 

- **Headlines:** Use tighter letter-spacing and semi-bold weights to create a strong anchor for sections.
- **Body:** Standardized at 14px for most SaaS interfaces to balance density and legibility.
- **Labels:** Used for buttons, chips, and table headers; often uppercase or medium weight to distinguish from body text.
- **Monospace:** While Geist Sans is primary, Geist Mono (included in the Geist family) should be used for IDs, code snippets, or data-heavy tabular values.

## Layout & Spacing

The layout follows a strict **4px baseline grid**. All margins and paddings must be multiples of 4px.

- **Grid:** Use a 12-column fluid grid for main content areas, but prefer flexbox-based utility layouts for toolbars and sidebars.
- **Density:** High. Vertical spacing between related items should be small (`8px` or `12px`), while major sections are separated by `24px` or `48px`.
- **Alignment:** All elements must align to the grid. Use solid `#353944` borders rather than whitespace to define distinct zones (e.g., separating a sidebar from the main content).

## Elevation & Depth

Depth is represented through **Tonal Layering** and **Bold Outlines**. 

1. **Level 0 (Background):** `#0F131D`. The lowest layer.
2. **Level 1 (Surface):** `#171C25`. Used for elevated containers, input fields, and navigation panels.
3. **Level 2 (Interaction):** Also uses `#171C25` but is distinguished by the accent border or a slightly lighter background hover state (e.g., `#1D2431`).

**Rules:**
- Never use shadows.
- Use a solid 1px border (`#353944`) to separate any two adjacent surfaces.
- For modal overlays, use a semi-transparent black (`rgba(0,0,0,0.5)`) to dim the background, but the modal itself must have a sharp 1px border.

## Shapes

The design system uses a **Sharp (0px)** corner radius for all elements. This reinforces the technical, utility-first aesthetic. 

- **Buttons:** Perfectly rectangular.
- **Inputs:** Sharp corners.
- **Cards/Modals:** Sharp corners.
- **Chips:** Rectangular with small 2px padding, no rounding.

If a slight softening is required for accessibility/usability on mobile targets, a maximum of `2px` may be used, but the default preference is `0px`.

## Components

### Buttons
- **Primary:** Background `#1ED760`, text `#0F131D`, sharp corners. No border.
- **Secondary:** Background transparent, text `#FFFFFF`, 1px border `#353944`.
- **Ghost:** Background transparent, text `#9BA3AF`. Border appears only on hover.

### Input Fields
- **Default:** Background `#171C25`, 1px border `#353944`, text `#FFFFFF`, sharp corners.
- **Focus:** Border color changes to `#1ED760`. No glow or outer ring.
- **Placeholder:** Text color `#4B5563`.

### Chips & Badges
- Small, rectangular blocks. Background `#171C25`, 1px border `#353944`, text `#9BA3AF`, label-md font style.

### Lists & Tables
- Row dividers are solid 1px `#353944`. 
- Active/Selected rows use a subtle background highlight of `#1D2431` and a 2px vertical stripe of `#1ED760` on the far left.

### Checkboxes & Radios
- Square (0px radius) for both checkboxes and radio buttons.
- Checked state: Background `#1ED760` with a `#0F131D` checkmark or center square.