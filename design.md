# Design System Inspired by Ground Station

## 1. Visual Theme & Atmosphere

Ground Station's interface is built for operators who need clarity under pressure. The design language is technical and cinematic — a dark-first dashboard aesthetic where data is the hero and the UI exists only to frame it. The philosophy is one of controlled density: every panel, border, and status indicator is engineered to reduce cognitive load while presenting a large volume of real-time information.

The visual foundation rests on Material-UI v7 augmented by Toolpad Core, but it departs from standard Material Design through aggressive customization. Rather than relying on MUI's default elevation and shadows, the system replaces them with a border-driven architecture — thin 1px lines that carve the interface into discrete cells like a mission control console. Surfaces are flat, colors are desaturated, and the only saturation comes from status indicators that must demand attention.

Typography is functional and utilitarian. Roboto serves as the workhorse typeface across the entire interface, chosen for its mechanical clarity at small sizes. The hierarchy is expressed through weight and size rather than decorative flourishes. Monospace is reserved for frequencies, sample rates, and telemetry — any value that an operator must read with absolute precision. Headings are tight and bold; body text is compact; captions are heavily used for metadata and state labels.

The color system is theme-aware and supports seven distinct presets, but the default experience is a deep charcoal dark mode. The palette is intentionally muted: primary actions use a desaturated steel blue (`#8fa8c4`), while status colors are more saturated by necessity — success glows in mint green (`#59d98b`), warnings burn in amber (`#ffcc66`), and errors pulse in coral red (`#ff5d6c`). This creates a clear hierarchy where neutral UI elements recede and operational states advance.

**Key Characteristics:**
- Dark-first default with 7 selectable themes (including OLED black and specialty "Sonar" / "S.T.A.L.K.E.R." modes)
- Border-driven architecture: 1px solid borders replace shadows as the primary structural language
- Flat, elevation-zero surfaces with subtle tinted backgrounds for semantic grouping
- Desaturated primary palette with highly saturated status/action colors for operational clarity
- Roboto as the universal sans-serif, monospace for all technical metrics and frequencies
- Compact data density: small buttons, compact DataGrids, minimal whitespace between related controls
- Glowing 8px status dots with colored box-shadow halos for instant state recognition
- Custom HTML5 Canvas elements (waterfall, bandscope) that require manual palette synchronization

## 2. Color Palette & Roles

### Default Dark Theme (Primary)
| Token | Hex / Value | Role |
|-------|-------------|------|
| `primary.main` | `#8fa8c4` | Primary actions, active navigation, key headlines |
| `secondary.main` | `#d6926b` | Secondary accents, selected rows, alternate highlights |
| `success.main` | `#59d98b` | Connected status, running state, play actions |
| `warning.main` | `#ffcc66` | Warnings, connecting state, polling indicators |
| `error.main` | `#ff5d6c` | Errors, disconnected state, stop actions |
| `info.main` | `#8f969e` | Informational labels, neutral highlights |
| `background.default` | `#111213` | Root page background, the deepest canvas |
| `background.paper` | `#1a1c1e` | Card backgrounds, panel surfaces, dialog bodies |
| `background.elevated` | `#23262a` | App bar, title bars, raised headers |
| `background.titleBar` | `#171a1d` | Dialog title bars, section headers |
| `border.main` | `#383c42` | Standard structural borders, dividers |
| `border.light` | `#454a51` | Hover borders, elevated separators |
| `border.dark` | `#2b2f35` | Subtle inner borders, inset lines |
| `overlay.light` | `rgba(154, 159, 166, 0.06)` | Subtle hover scrims |
| `overlay.medium` | `rgba(154, 159,  166, 0.12)` | Active state overlays |
| `overlay.dark` | `rgba(0, 0, 0, 0.6)` | Modal backdrops, heavy scrims |

### Slate Blue Theme (dark alternate)
| Token | Hex / Value | Role |
|-------|-------------|------|
| `primary.main` | `#4f9dff` | Brighter blue for primary actions |
| `secondary.main` | `#7bd3b0` | Teal accent for secondary highlights |
| `background.default` | `#111315` | Slightly cooler dark background |
| `background.paper` | `#181b1e` | Cool gray panel surface |
| `border.main` | `#2a2f35` | Cooler, softer structural borders |

### Light Theme
| Token | Hex / Value | Role |
|-------|-------------|------|
| `primary.main` | `#1565c0` | Classic MUI blue for primary actions |
| `secondary.main` | `#ad1457` | Magenta accent |
| `background.default` | `#edf1f5` | Soft blue-gray page background |
| `background.paper` | `#ffffff` | Pure white panels |
| `background.elevated` | `#e2e7ee` | Slightly darker elevated surfaces |
| `border.main` | `#b5bec8` | Medium gray structural borders |

### Specialty Themes
- **Night (OLED)**: `primary` `#7f77c3` (soft purple), `background.default` `#000000` — optimized for OLED displays with pure black
- **S.T.A.L.K.E.R.**: `primary` `#7fb800` (radioactive green), `secondary` `#b85d00` (rust), `background.default` `#0a0d0a` — industrial survival aesthetic
- **Sonar**: `primary` `#ffb000` (amber), `secondary` `#ff6600` (rust), `background.default` `#000000` — submarine command center aesthetic

### Semantic Status Colors
| State | Color | Use |
|-------|-------|-----|
| Connected | `#59d98b` | Green glow dot, running chips |
| Connecting | `#ffcc66` | Amber glow dot, spinner contexts |
| Disconnected | `#ff5d6c` | Red glow dot, error alerts |
| Polling | `#ff8f5a` | Orange glow dot, intermittent state |
| Play | `#59d98b` | Start/record actions |
| Stop | `#ff5d6c` | Halt/stop actions |

### Text Colors
- **Primary text**: `theme.palette.text.primary` (auto-mapped by MUI)
- **Secondary text**: `theme.palette.text.secondary` (auto-mapped by MUI)
- **Disabled text**: `theme.palette.text.disabled` (auto-mapped by MUI)
- **Monospace technical text**: inherits `text.primary` or `text.secondary` but uses `fontFamily: 'monospace'`

## 3. Typography Rules

### Font Family
- **Primary sans-serif**: `Roboto, Arial, sans-serif`
- **Monospace**: `monospace` (system fallback) for all frequencies, sample rates, memory/CPU metrics, and hex data
- MUI's default type scale is used; the app does not override the base typography object at the theme level

### Hierarchy

| Role | Variant | Size | Weight | Line Height | Notes |
|------|---------|------|--------|-------------|-------|
| App Title / Dialog Title | `h6` | 1.25rem (20px) | 500 | 1.6 | Top-level page and dialog headers |
| Section Header | `subtitle1` | 1rem (16px) | 600 | 1.75 | Card section headers, panel labels |
| Widget Title | `subtitle2` | 0.875rem (14px) | 700 | 1.57 | Panel title bars, compact headers |
| Body | `body2` | 0.875rem (14px) | 400 | 1.43 | General body text, descriptions |
| Caption / Label | `caption` | 0.75rem (12px) | 600/700 | 1.66 | Status text, metadata, badges |
| Overline | `overline` | 0.75rem (12px) | 400 | 1.2 | Sidebar labels, small caps sections |
| Monospace Metric | `body2` + mono | 0.875rem | 400 | 1.43 | Frequencies, rates, technical data |
| Toolbar Time | custom | 0.65rem (10.4px) | bold | 1.5 | App bar clock display |
| DataGrid Header | custom | 0.8125rem (13px) | 700 | — | Column headers with `letterSpacing: 0.02em` |
| Quick Filter | custom | 0.72rem (11.5px) | 500 | — | Compact table filter buttons |

### Principles
- **Density over air**: Text is set compactly. Most body text is `body2` at 14px rather than 17px. Whitespace is reserved for structural borders, not expansive padding.
- **Weight as hierarchy**: The system relies heavily on `fontWeight: 600` and `fontWeight: 700` to create hierarchy rather than large size jumps.
- **Monospace as trust signal**: Any value that could be misread (frequency `145.800 MHz`, sample rate `2.4 MSPS`) is rendered in monospace to ensure character-level precision.
- **No optical sizing**: Unlike Apple SF Pro, Roboto does not switch optical sizes. The same face serves display and body roles.

## 4. Component Stylings

### Buttons

**Primary Action**
- `variant="contained"`
- Background: `theme.palette.primary.main`
- Text: `theme.palette.primary.contrastText` (auto)
- Padding: standard MUI small/medium
- Use: Save, Add, Submit, Start

**Destructive Action**
- `variant="contained" color="error"`
- Background: `#ff5d6c` (dark) / `#c62828` (light)
- Use: Delete, Remove, Stop

**Secondary Action**
- `variant="outlined"`
- Border: `theme.palette.primary.main`
- Text: `theme.palette.primary.main`
- Use: Cancel, Refresh, Discover, Close

**Quick Filter Button**
- Height: `24px`
- Padding: `py: 0, px: 1`
- Font size: `0.72rem`
- Min-height: `24px`
- Use: Satellite table group filters, compact toggles

### Cards & Panels

**Standard Card**
- Background: `theme.palette.background.paper`
- Border: `1px solid theme.palette.border.main`
- Border radius: `6px` (global shape default)
- Elevation: `0` (shadows are intentionally absent)
- Padding: `16px` (`p: 2`)
- Common min-height: `220px` for info cards

**Semantic Tinted Cards**
The system uses extremely subtle tinted backgrounds paired with matching border tints for system metric cards:
- **Info/CPU**: `rgba(33, 150, 243, 0.05)` bg + `rgba(33, 150, 243, 0.12)` border
- **Warning/Temperature**: `rgba(255, 87, 34, 0.05)` bg + `rgba(255, 87, 34, 0.12)` border
- **Secondary/Memory**: `rgba(156, 39, 176, 0.05)` bg + `rgba(156, 39, 176, 0.12)` border
- **Success/OS**: `rgba(76, 175, 80, 0.05)` bg + `rgba(76, 175, 80, 0.12)` border

**Island Container (`StyledIslandParent`)**
- Background: `theme.palette.background.paper`
- Border: `1px solid theme.palette.border.main`
- Padding: `0`
- Overflow: `hidden`
- Use: Dashboard widget containers, map wrappers, waterfall shells

### Forms

**Text Fields**
- `size="small"`
- `fullWidth` by default
- Background: overridden globally to `theme.palette.background.paper`
- Border radius: inherited from theme `shape.borderRadius` (6px)

**Selects / Autocompletes**
- Same `size="small"` treatment
- Paper background override for dropdowns

**Dialogs**
- Background: `theme.palette.background.paper`
- Border: `1px solid theme.palette.divider`
- Title bar: `background.titleBar` (`#171a1d` dark, `#dce5ef` light) with bottom divider
- Actions bar: matching title bar with top divider
- Border radius: `16px` (`borderRadius: 2` in some contexts)

### Tables (DataGrid)

**Header**
- Background: `alpha(theme.palette.primary.main, 0.18)` (dark) / `0.10` (light)
- Bottom border: `2px solid alpha(theme.palette.primary.main, 0.45)`
- Font: `0.8125rem`, weight `700`, `letterSpacing: 0.02em`

**Row States**
Custom CSS class mappings for satellite visibility states:
- `.satellite-row-visible` — left border `success.main`, subtle success background tint
- `.satellite-row-below-horizon` — left border `info.main`, subtle info background tint
- `.satellite-row-dead` — left border `error.main`, muted text color, subtle error tint
- `.satellite-row-selected` — left border `secondary.main`, bold text

**Density**
- `density="compact"` for satellite tables
- Focus outlines globally removed via `outline: 'none'` on cells and headers

### Navigation

**App Bar**
- Height: `52px` (`minHeight: 52px`)
- Dark: `background.elevated` with bottom border `border.main` and shadow `0 2px 4px rgba(0,0,0,0.5)`
- Light: `primary.main` with shadow `0 2px 8px rgba(0,0,0,0.15)`
- Backdrop filter: `blur(4px)`

**Desktop Drawer**
- Expanded width: `240px`
- Collapsed width: `56px`
- Background: `#1e1e1e` (dark) / `#f5f5f5` (light)
- Right border: `#4b4b4b` (dark) / `#e0e0e0` (light)

### Status Indicators

**Status Dot (`StatusIndicator` / `StatusBadge`)**
- Size: `8px × 8px` circle
- Box shadow: `0 0 6px <color>99` (colored glow halo)
- Colors mapped to connection states

**Chips**
- `size="small"`
- Height: `18px` for satellite status chips
- Variant: `outlined` for status, `filled` for API key state

### Media / Canvas

**Waterfall & Bandscope**
- Custom HTML5 Canvas rendering
- Colors are hardcoded per theme and MUST be manually updated when adding new themes
- Not part of the MUI theme token pipeline

## 5. Layout Principles

### Spacing System
- Base unit: 8px (MUI default)
- Common values:
  - `0.5` (4px) — tight icon gaps, inline padding
  - `1` (8px) — standard internal padding
  - `1.5` (12px) — moderate spacing
  - `2` (16px) — card padding, dialog content gaps, grid gaps
  - `3` (24px) — major section spacing

### Grid & Container
- **MUI Grid v2**: used with `size={{ xs: 12, md: 6 }}` patterns
- **CSS Grid**: `gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'` for responsive card layouts
- **React Grid Layout**: dashboard widgets with breakpoints `{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}`
- **Main content**: `flexGrow: 1`, offset `mt: '52px'` below app bar

### Whitespace Philosophy
- **Borders create structure, not whitespace**: Panels are visually separated by 1px lines rather than generous gaps
- **Compression within panels**: Cards and tables are information-dense
- **Expansion between major views**: Route-level transitions provide the mental break; individual components stay tight

### Border Radius Scale
- `6px` — global default for buttons, cards, inputs, panels
- `8px` — occasional buttons (MUI default contained button radius)
- `11px` — filter/search inputs
- `16px` — dialogs, modals
- `50%` — status dots, circular icon buttons

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, solid background, 1px border | Standard cards, panels, tables |
| Elevated Header | Background `background.elevated` + bottom border | App bar, title bars |
| Modal Backdrop | `rgba(0, 0, 0, 0.6)` with optional `backdropFilter: blur(4px)` | Dialog overlays, page blockers |
| Interactive Hover | `backgroundColor: overlay.light` (6% tint) | List rows, icon buttons |
| Status Glow | `boxShadow: 0 0 6px <color>99` | Connection dots, badges |
| Grid Drag Mode | Diagonal stripe background (`#555` / `#E6EDF5`) + grab cursor | Dashboard widget reordering |
| Z-Index Layering | App bar > drawer > map controls (500) > waterfall overlay (450) | Stacked UI elements |

**Shadow Philosophy**: Ground Station actively rejects Material Design's elevation shadows. The only shadows permitted are:
1. The app bar's subtle drop shadow (`0 2px 4px` dark / `0 2px 8px` light)
2. Status indicator glow halos
3. React Grid Layout drag shadows

Depth is communicated through background color steps (`default` → `paper` → `elevated`) and structural borders, not cast shadows.

## 7. Do's and Don'ts

### Do
- Use the 1px border architecture as the primary structural tool
- Keep card backgrounds at `background.paper` and elevated headers at `background.elevated`
- Apply `size="small"` to buttons and inputs by default — the UI is dense
- Use monospace for any numerical metric an operator must read precisely
- Theme new canvas elements (waterfall, charts) manually when adding themes
- Use the glowing `StatusIndicator` for any connection/running state
- Keep dialog title bars and action bars on `background.titleBar`
- Apply `elevation={0}` to cards and rely on borders for definition

### Don't
- Don't use large default MUI shadows on cards or panels
- Don't introduce new accent colors outside the theme presets
- Don't use `body1` (17px) as default body text — the app prefers `body2` (14px)
- Don't forget to update hardcoded canvas colors when creating new themes
- Don't use wide letter-spacing — the system runs tight and compact
- Don't make the app bar opaque without the bottom border and subtle shadow
- Don't use gradient backgrounds for structural surfaces

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | `< sm` (0-600px) | Single column, temporary drawer, waterfall full-width |
| Tablet | `sm - md` (600-900px) | 2-column grids begin, compact table columns hidden |
| Desktop | `md - lg` (900-1200px) | Full layout, expanded drawer, all table columns |
| Large Desktop | `> lg` (1200px+) | Dashboard widgets at full size, observation indicators visible |

### Touch Targets
- Buttons: standard MUI small/medium targets (minimum 30-40px height)
- Navigation items: full drawer row height
- Status dots: 8px visual indicator only — not a touch target
- Media controls: circular icon buttons at standard MUI size

### Collapsing Strategy
- **Drawer**: persistent at `240px` on desktop, collapses to `56px`, becomes temporary overlay on mobile
- **Tables**: columns hide at `md` and `sm` breakpoints based on priority
- **Waterfall**: stacks vertically on mobile (`down('sm')`)
- **Dashboard widgets**: React Grid Layout reflows across 5 breakpoints
- **App bar indicators**: active/upcoming observation panels appear only at `min-width: 1400px`

## 9. Agent Prompt Guide

### Quick Color Reference
- Page background (dark): `#111213`
- Panel background (dark): `#1a1c1e`
- Elevated surface (dark): `#23262a`
- Primary action (dark): `#8fa8c4`
- Success/connected: `#59d98b`
- Warning/connecting: `#ffcc66`
- Error/disconnected: `#ff5d6c`
- Structural border: `#383c42`
- Light page background: `#edf1f5`
- Light panel background: `#ffffff`

### Example Component Prompts
- "Create an info card for CPU usage. Background: `rgba(33, 150, 243, 0.05)` with a 1px border `rgba(33, 150, 243, 0.12)`. Border radius 6px. Padding 16px. Title at `subtitle1` (16px, weight 600). Value in monospace `body2` (14px). No shadow."
- "Design a satellite status row for a DataGrid. Left border color indicates state: `success.main` for visible, `info.main` for below horizon, `error.main` for dead. Use `outline: none` on cells. Header background is `alpha(primary.main, 0.18)` with a 2px bottom border."
- "Build the app bar: 52px height, dark mode uses `background.elevated` (`#23262a`) with bottom border `#383c42` and shadow `0 2px 4px rgba(0,0,0,0.5)`. Include a `blur(4px)` backdrop filter. Left: hamburger toggle. Center: page title `h6` (20px). Right: system time in monospace at 0.65rem bold."
- "Create a connection status indicator: 8px circle with background matching the state color and `boxShadow: 0 0 6px <color>99`. States: connected `#59d98b`, connecting `#ffcc66`, disconnected `#ff5d6c`, polling `#ff8f5a`."
- "Design a settings dialog: background `#1a1c1e`, title bar `#171a1d` with bottom divider, actions bar `#171a1d` with top divider, border radius 16px. Form fields are `size="small"` with `background.paper` override. Primary button is `contained`, secondary is `outlined`."

### Iteration Guide
1. Every structural container gets a 1px border (`border.main`) and `borderRadius: 6px` — this is the system's skeleton
2. Cards always use `elevation={0}` — never rely on shadow for card definition
3. Technical values (frequencies, sample rates, memory) must use `fontFamily: 'monospace'`
4. Status indicators must include the colored glow shadow (`0 0 6px color99`)
5. Canvas-based components (waterfall, charts) need manual color mapping per theme
6. The app bar is either dark elevated (`#23262a`) or light primary (`#1565c0`) with appropriate shadow
7. Typography defaults to compact: `body2` (14px) over `body1` (17px)
8. Every new theme must define `background.default`, `background.paper`, `background.elevated`, `border.main`, and `primary.main` at minimum
