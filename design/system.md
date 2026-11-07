# Paranexo design system

Synced from project source (read-only) on 2026-11-06, after the Puente Cauce brand and liquid-glass implementation (branch `feat/liquid-glass-redesign`). Every entry names its source. Values not found in source are not listed.
Sources read: `styles/landing.css`, `styles/glass.css`, `styles/apps.css`, `styles/servicios.css`, `styles/contact.css`, `src/partials/nav.html`, `src/partials/footer.html`, `assets/brand/`. No Tailwind config, no component library, no token file. The prose rationale lives in `DESIGN.md` and `PRODUCT.md`.
Not a proposed starter: all values below exist in the project.

## Colors (light, default)

Source for all rows: `styles/landing.css` `:root` (brand kit Puente Cauce v2.0: Marfil, Blanco, Carbón, Naranja Cauce; the rest derived from it).

| Token | Value | Usage |
| --- | --- | --- |
| `--cream` | `#FCFBF8` | Warm near-white paper. Page background; text on Carbón and orange fills |
| `--surface` | `#FFFFFF` | Blanco. Cards, contact card, mail pill, glass tint base |
| `--ink` | `#20211F` | Carbón. Body text, headings, primary button fill |
| `--terra` | `#EF633C` | Naranja Cauce. Focus ring, logo, live dots, fills and graphics only (3.2:1 on white: never small text) |
| `--marfil` | `#FAF4E8` | Puente Cauce Marfil, reserved for selected panels |
| `--paper` | `var(--marfil)` | Alternate sections, liquid panel base, footer picture backdrop |
| `--line` | `#E5D9C4` | Derived. Borders, dividers, field strokes |
| `--ink-2` | `#4E4D48` | Derived. Secondary text, leads, meta (7.7:1 on Marfil) |
| `--terra-ink` | `#B5401C` | Derived. Orange text, links, eyebrows, primary button hover, errors (5.2:1 on Marfil) |
| `--terra-tint` | `#FCE3D8` | Derived. Icon tiles, selected chips, status pills, error field fill |
| `--petrol` | `#20211F` | Dark bands, now Carbón (name kept for compatibility) |
| `--river` | `#A8CFE3` | Illustrations and data only |
| `--river-ink` | `#2B6684` | Illustrations and data only |
| `--river-tint` | `#E2EFF6` | Illustrations and data only |

### On dark bands

Source: `styles/landing.css` `:root`. Same in both themes.

| Token | Value | Usage |
| --- | --- | --- |
| `--on-petrol` | `#FAF4E8` | Titles on Carbón bands |
| `--on-petrol-2` | `#E6DECC` | Body text on bands |
| `--on-petrol-3` | `#D8CFBD` | Secondary text on bands |
| `--terra-soft` | `#F59B7C` | Graphics and focus on bands |
| `--terra-on-petrol` | `#F6A184` | Accent text on bands |

## Colors (dark, `:root[data-theme="dark"]`)

Source: `styles/landing.css`. Overrides only: `--cream #1A1B18`, `--paper #20211F`, `--surface #212220`, `--line #37382F`, `--ink #FAF4E8`, `--ink-2 #C8C1B2`, `--terra #EF633C`, `--terra-ink #F79A78`, `--terra-tint #38231A`, `--petrol #111210`, `--river-ink #8FB9CF`, `--river-tint #1E2A30`. Illustrations, `.svc-card`, `.app-stage`, `.liquid-tile` and `.ex-card` keep the light palette (`color-scheme: light`). The nav and footer swap to `logo-horizontal-color-dark.svg`.

## Glass tokens

Source: `styles/glass.css`.

| Token | Light | Dark |
| --- | --- | --- |
| `--glass-tint` | `color-mix(in srgb, var(--surface) 66%, transparent)` | 70% |
| `--glass-tint-strong` | `color-mix(in srgb, var(--surface) 84%, transparent)` | 86% |
| `--glass-sheen` | `color-mix(in srgb, var(--surface) 70%, transparent)` | `rgba(255,255,255,.07)` |
| `--glass-edge` | `rgba(255,255,255,.85)` | `rgba(255,255,255,.16)` |
| `--glass-rim` | `color-mix(in srgb, var(--line) 80%, transparent)` | `rgba(255,255,255,.1)` |
| `--glass-shadow` | `0 22px 44px -26px rgba(32,33,31,.42), 0 2px 8px -2px rgba(32,33,31,.08)` | `0 22px 44px -26px rgba(0,0,0,.7), 0 2px 8px -2px rgba(0,0,0,.3)` |
| `--glass-blur` | `blur(18px) saturate(1.6)` | same |
| `--blob-op` | `.85` (sections tune it per use) | `.5` |

Liquid fields (`.blobs i`): three blurred shapes (`filter: blur(34px)`), colours from `--b1/--b2/--b3` per section (orange, terra-tint, paper, Carbón), animation `ooze` 18s / 23s / 29s alternate; paused off screen (`.paused`) and stopped under reduced motion; `.blobs` clips on the horizontal axis (`overflow-x: clip`) so fields never scroll the page sideways. Frosted layer (`.frost::before`): `color-mix(in srgb, var(--surface) var(--frost, 62%), transparent)` + `blur(16px) saturate(1.5)`.

## Typography

Source: `styles/landing.css` (`@font-face` loads locally hosted Latin/Latin-ext variable Bricolage Grotesque and DM Sans; licenses in `assets/fonts/`).

| Token / role | Value |
| --- | --- |
| `--serif` | `"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif` (legacy token name; display headings at weight 400) |
| `--sans` | `"DM Sans", ui-sans-serif, system-ui, sans-serif` (body 17px/1.6) |
| `--mono` | `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace` (eyebrows, labels, legal row, counters) |
| `.hero h1` | `clamp(42px, 5.6vw, 80px)` / 1.02, balanced |
| h2 | `clamp(34px, 4vw, 54px)` / 1.1 |
| Problem quote, FAQ summary | 23px display / 1.25–1.3 |
| Result title (`.res-h b`) | 27px display / 1.1 (`styles/glass.css`) |
| KPI number (`.kpi b`) | 44px display / 1.1, tabular figures (`styles/glass.css`) |
| `.lead` | 19px sans, `--ink-2`, max 56ch |
| Buttons | 600 16px; nav button 15px; `.mini` 14px |
| `.eyebrow` | mono 500 14px, `--terra-ink`, sentence case, no tracking |
| Footer column head | mono 500 13px, `--terra-ink` |
| Legal row | mono 500 12px, `--ink-2` |
| Emphasis | colour only (`--terra-ink`), never italic |

## Spacing

Source: `styles/landing.css`. Container `.wrap` = `min(1200px, 100% - 48px)`. Sections `padding: clamp(64px, 10vw, 120px) 0`, `scroll-margin-top: 72px`; a section that follows another drops its top padding (`#problemas`, `#preguntas`, `#hablemos` on the home), so neighbours are always one step apart (120px desktop, 64px phone). Hero `clamp(56px, 8vw, 96px) 0 clamp(40px, 6vw, 96px)`. Cards 24–40px inside; problem card 28px 24px. Footer text starts `clamp(20px, 2.4vw, 32px)` below the picture. Touch targets 44px minimum.

## Radius

Source: `styles/landing.css` `:root`.

| Token | Value | Usage |
| --- | --- | --- |
| `--r-surface` | 0 | Printed surfaces: cards, contact card, banners |
| `--r-control` | 3px | Buttons, inputs, focus ring |
| `--r-glass` | 20px | The one rounded material: glass panels, liquid tiles, mobile menu, help box (CTA panel `+12px`) |
| `--r-glass-sm` | 14px | Small glass: KPI, table, file row, toast |
| `--r-pill` | 999px | Chips, tags, mail pill, scrolled nav, status pills, rails |
| 50% | circle | Icon-only controls (theme, menu), avatars, check marks, process pier dots |


## Shadows

| Value | Source | Usage |
| --- | --- | --- |
| `inset 0 1px 0 var(--glass-edge), var(--glass-shadow)` | `styles/glass.css` | Every `.glass`, scrolled nav, mobile menu |
| `0 40px 70px -50px rgba(32,33,31,.5)` | `styles/landing.css` | `.cta-panel` |

| `0 30px 70px -50px rgba(29,44,49,.35)` | `styles/contact.css` | `.contact-card` |

Motion: `--ease: cubic-bezier(.22,.8,.26,1)` (hover .15–.3s), `--spring: cubic-bezier(.3, 1.35, .45, 1)` (pills, check marks, liquid tiles). Example players play once on view and stop; every motion has a finished state under `prefers-reduced-motion`.

## Components

Source: `styles/landing.css` unless noted.

- Focus: `:focus-visible { outline: 3px solid var(--terra); outline-offset: 3px; border-radius: var(--r-control) }`.
- `.btn`: inline-flex, gap 8px, padding 12px 24px, radius `--r-control`, 600 16px, 1.5px border `--ink`; `:active` scale .98; `.arrow` moves 4px on hover.
- `.btn-primary`: fill `--ink`, text `--cream`; hover fill and border `--terra-ink`.
- `.btn-ghost`: transparent, text `--ink`.
- `.mini`: min-height 44px, padding 8px 16px, 14px. `.replay` (`styles/apps.css`): mini + glass tint, dotted replay icon 18px.
- Round control (`.theme-toggle`, `.menu-toggle`): 44×44, circle, 1.5px `--line`, hover border `--ink`.
- Nav (`src/partials/nav.html`): sticky, 68px, Marfil at 86% with blur; `.scrolled` becomes a 60px glass pill; logo `assets/brand/logo-horizontal-color.svg` 216px; links 15px `--ink-2`, current page 600 `--ink` with a 2px `--terra` underline offset 8px; under 900px a glass dropdown.
- Hero: copy centered over the dotted bridge canvas (`src/hero-dots.mjs`, unchanged), CTAs inside a glass cluster (`.hero-ctas.cluster`).
- Problem card (`.problem`): glass-strong tint, 28px 24px, hover lifts 4px; number mono 600 13px `--terra-ink`; quote 23px serif.
- Glass (`.glass`, `styles/glass.css`): tint, blur, 1px rim, inner top highlight, sheen gradient at 118deg, radius `--r-glass`.
- Liquid (`.liquid` + `.blobs` + `.frost`): paper base, morphing fields, frosted layer between fields and text.
- Status pill (`.pill`): pill, 600 14.5px, glass-strong; dotted spinner while running, check when done.
- Example panels (`styles/glass.css`): task list with strike-through on done, agents rows with sliding sub-status, result card (27px serif title, 3-column table, file row), dashboard mock (KPI 44px serif), chat bubbles (outgoing `--terra-ink` with `--cream` text).
- Liquid tile tabs (`.liquid-tile`, `styles/apps.css`): 132px, radius `--r-glass`, selected grows (flex 2.3, spring) and softens to `30px 18px 30px 18px`.
- Page hero (`.hero.page-hero`, `styles/pages.css`): shared by Servicios, Cómo trabajamos, Quiénes somos and the 404 page; centered eyebrow, display title `clamp(42px, 6.2vw, 92px)` max 20ch, `--ink` lead max 52ch, CTAs in a glass cluster, liquid field at `--blob-op: .3`, radial `--cream` veil (90%) behind the copy for AA.
- Centered section head (`.sec-head-center`, `styles/pages.css`): title max 20ch and lead max 60ch, stacked and centered.
- Service detail (`.detail`, `.ex-card`, `styles/servicios.css`): copy beside a sticky glass example that plays once, with "Ver de nuevo"; the only place each main service is explained (old service URLs redirect to `servicios/#software`, `#automatizaciones`, `#ia`).
- Hero problem chips (`.chips`, `styles/servicios.css`): glass pills, min-height 44px, that jump to each service detail; the 404 page reuses them for the main pages.
- Secondary service tiles (`.tiles`, `.stile`): four equal glass tiles, 2×2 (`grid-auto-rows: 1fr`), one column under 900px; title at the top, "Consultanos" link pinned to the foot (`margin-top: auto`), looping line glyph in a 112px glass square.
- Process band (`.how-band`): bordered band with one question, one line and a ghost button to Cómo trabajamos; stacks under 640px.
- Process bridge (`.bridge`, `.pier`, `styles/pages.css`): five columns on a subgrid with three rows (client bank on `--paper`, deck with a 3px `--terra` line, ringed pier dot, mono number, title and a `--terra-tint` takeaway pill on one shared line, team row in `--ink-2`); a legend names the rows once and each step keeps "Vos"/"Nosotros" for screen readers; vertical deck below 1100px; the line draws in on reveal, static under reduced motion.
- 404 page (`src/pages/404.html`): page hero with "Esta página no existe", "Ir al inicio" and "Escribinos", chips to the main pages; root-absolute links, `noindex`, no canonical, outside the sitemap.
- Chip (`.contact-topics span`, `styles/contact.css`): pill, `--cream`, 1px `--line`, 9px 16px, 650; selected `--terra-tint` with `--terra-ink`.
- Field (`styles/contact.css`): `--cream`, 1.5px `--line`, radius `--r-control`, 13px 15px; focus border `--terra-ink`; invalid `--terra-tint` fill.
- Contact card (`styles/contact.css`): `--surface`, 1px `--line`, square, shadow above.
- Footer (`src/partials/footer.html`, `src/footer.mjs`): `assets/footer-paseo-parana.jpg` band `clamp(210px, 27vw, 370px)` fading into `--cream`, water ripples and falling petals (paused off screen, static under reduced motion); below on solid `--cream`: logo 208px, tagline, active mail pill (44px, pill, `--surface`, `--terra-tint` icon disc), three link columns, mono legal row with coordinates. Social profile links await real URLs.
- Logo files (`assets/brand/`): `logo-horizontal-color.svg` (light), `logo-horizontal-color-dark.svg` (dark), `favicon.svg` (the tab icon on every page). Never redraw; no filters.
- Breakpoints in use: 1100px (nav tightens, process bridge turns vertical), 900px (nav collapses, columns stack), 640px (single column), 560px, 400px.
