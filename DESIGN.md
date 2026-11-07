---
name: Paranexo
description: Custom software, automation and AI for pymes in the Argentine Northeast, under the Puente Cauce identity.
colors:
  naranja-cauce: "#EF633C"
  naranja-texto: "#B5401C"
  naranja-tinte: "#FCE3D8"
  carbon: "#20211F"
  carbon-suave: "#4E4D48"
  papel: "#FCFBF8"
  marfil: "#FAF4E8"
  linea-calida: "#E5D9C4"
  blanco: "#FFFFFF"
  rio: "#A8CFE3"
  rio-tinta: "#2B6684"
  rio-tinte: "#E2EFF6"
  noche-fondo: "#1A1B18"
  noche-superficie: "#212220"
  noche-linea: "#37382F"
  noche-texto-suave: "#C8C1B2"
  noche-naranja-texto: "#F79A78"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(42px, 5.6vw, 80px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(34px, 4vw, 54px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-monospace, SF Mono, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  surface: "0px"
  control: "3px"
  glass-sm: "14px"
  glass: "20px"
  pill: "999px"
spacing:
  wrap: "1200px"
  gutter: "24px"
  control-y: "12px"
  control-x: "24px"
  touch: "44px"
components:
  button-primary:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.papel}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.naranja-texto}"
    textColor: "{colors.papel}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.carbon}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-mini:
    rounded: "{rounded.control}"
    padding: "8px 16px"
    height: "44px"
  input:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.control}"
    padding: "13px 15px"
  chip:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
  chip-selected:
    backgroundColor: "{colors.naranja-tinte}"
    textColor: "{colors.naranja-texto}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.surface}"
  glass-panel:
    rounded: "{rounded.glass}"
    textColor: "{colors.carbon}"
  footer-mail:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.pill}"
    height: "44px"
---

# Design System: Paranexo

## Overview

**Creative North Star: "El puente al atardecer"**

The Puente General Belgrano at sunset over the Paraná is the system's whole argument: a bridge joins a small business with the technology it needs, and the warm low sun is the one light that tells the eye where to go. Pages are warm near-white paper (Papel) written in charcoal ink (Carbón), with Marfil reserved for selected panels, and the bridge's orange (Naranja Cauce) appears where the eye should land: the logo, a CTA's hover, a focus ring, a live status, the dots of the bridge itself. The river's blue never becomes interface; it stays in the water of the illustrations and in data.

Two materials share the page. Printed surfaces (sections, cards, problem quotes, contact card) stay square and quiet, set in Bricolage Grotesque headings and DM Sans text. Liquid glass is the one rounded, living material: translucent panels with a soft blur, an inner highlight and slowly drifting orange and ivory fields behind them. Glass is where the visitor sees the system working (the animated app examples, the scrolled nav pill, the CTA panel), so it reads as a different object from a card. The feel is warm and tactile: things respond to touch with a small lift and a sheen, never with flashing.

Motion is calm and finite: the dotted bridge builds once and breathes, examples play a short story (an order arrives, the stock updates, the invoice is issued) and stop, petals fall in the footer, water ripples. Everything has a finished, static state under reduced motion. The system must never look like generic SaaS (violet-blue gradients, identical icon cards, template rhythm), a cold corporate agency (institutional blue, office stock photos, distant tone) or dark hacker tech (black backgrounds with neon, terminal aesthetics).

**Key Characteristics:**
- Near-white paper and charcoal, with Marfil panels and one orange light that guides the eye.
- Square printed surfaces; rounded liquid glass only where the system is shown working.
- Bricolage Grotesque for display, DM Sans for reading, mono only for small labels.
- The bridge and the river are the recurring image: dotted bridge hero, Paseo del Paraná footer.
- Tactile, finite motion with a full reduced-motion fallback.

## Colors

A warm two-ink palette from the Puente Cauce kit (Papel base, Marfil panels, Carbón ink, Naranja Cauce light), with derived shades that keep every text pair at WCAG AA.

### Primary
- **Naranja Cauce** (`naranja-cauce`): the bridge and the sun. Logo, focus rings, live-status dots, the hero bridge, liquid fields, accent fills under charcoal or white text. Fills and graphics only.
- **Naranja Texto** (`naranja-texto`): the orange that can be read. Eyebrows, links, small accent text, primary button hover, error text and borders, selected chips (5.2:1 on Marfil).
- **Naranja Tinte** (`naranja-tinte`): warm wash for icon tiles, selected chips, error field backgrounds and status pills.

### Tertiary
- **Río** (`rio`), **Río Tinta** (`rio-tinta`), **Río Tinte** (`rio-tinte`): the Paraná's water. Only inside illustrations, the hero bridge's river dots and data/status chips in the app examples.

### Neutral
- **Papel** (`papel`): near-white page background and text on charcoal and orange fills.
- **Marfil** (`marfil`): alternate sections, footer picture backdrop, liquid panel base.
- **Línea Cálida** (`linea-calida`): borders, dividers, field strokes, glass rim.
- **Blanco** (`blanco`): cards, the contact card, the mail pill, glass tint base.
- **Carbón** (`carbon`): body text, headings, primary buttons, dark bands (the former petrol bands).
- **Carbón Suave** (`carbon-suave`): secondary text, leads, meta, footer links (7.7:1 on Marfil).
- **Noche** (`noche-fondo`, `noche-superficie`, `noche-linea`, `noche-texto-suave`, `noche-naranja-texto`): the dark theme, built from Carbón; text turns Marfil, orange text lightens so it still reads.

### Named Rules
**The One Light Rule.** Naranja Cauce is the only saturated color in the interface. If orange text is small, it is Naranja Texto, never Naranja Cauce (3.2:1 on white fails AA).

**The River Stays in the Water Rule.** Blue never colors a button, link, heading or section. It lives in the river of an illustration or in a data chip.

## Typography

**Display Font:** Bricolage Grotesque (with ui-sans-serif and system fallbacks)
**Body Font:** DM Sans (with ui-sans-serif and system fallbacks)
**Label/Mono Font:** ui-monospace (SF Mono, Menlo, Consolas)

**Character:** Bricolage Grotesque lends a slightly irregular, crafted voice to large headings; DM Sans keeps explanations and controls calm and legible. Both are self-hosted variable fonts with Latin and Latin-ext subsets; every page preloads only the two Latin files the hero renders with, and no retired face (Instrument Serif, Archivo, Fraunces) ships.

### Hierarchy
- **Display** (400, `clamp(42px, 5.6vw, 80px)`, 1.02): the hero promise only, balanced to its content.
- **Headline** (400, `clamp(34px, 4vw, 54px)`, 1.1): section titles.
- **Title** (400, 23–30px, 1.05–1.3): problem quotes, FAQ questions, card and member titles.
- **Body** (400, 17px, 1.6): running text; leads at 19px, max 56ch, in Carbón Suave.
- **Label** (500, 12–14px mono): eyebrows, footer column heads, step numbers, the legal row, "Ejemplo" tags. Sentence case.

### Named Rules
**The Calm Weight Rule.** Bricolage Grotesque is variable, but large headings remain 400; hierarchy comes from size and measure, not bolding every heading.

**The Color-Only Emphasis Rule.** Emphasis inside a headline is a color change to Naranja Texto, never italic.

## Layout

A centered column of `min(1200px, 100% − 48px)`. Sections share one vertical rhythm: each pads `clamp(64px, 10vw, 120px)` top and bottom, and a section that follows another drops its top padding, so the gap between neighbours is always one step (120px on desktop, 64px on phones), never two. The home hero centers its copy over the full-width dotted bridge canvas, which keeps the copy zone free of dots; Servicios, Cómo trabajamos and Quiénes somos share the page hero described under Components. Content blocks switch between two-column splits (headline left, lead right; detail text beside its live example, alternating sides on the services page), centered section heads (title and lead stacked and centered, used on Servicios and Cómo trabajamos) and single columns.

Liquid fields are clipped on the horizontal axis (`overflow-x: clip` on `.blobs`), so their blur bleeds up and down but never makes the page scroll sideways.

Breakpoints are content-driven: around 1100px the nav tightens and the process bridge turns vertical, at 900px it collapses into a toggle with a glass dropdown, at 640px grids stack, and at 560 and 400px controls stack and padding shrinks. Checked at 375, 768 and 1280+; layouts recompose per breakpoint instead of scaling down. Touch targets are at least 44px.

## Elevation & Depth

Hybrid. Printed surfaces are flat or carry one long, soft drop shadow tinted with charcoal (`0 30px 60px -40px rgba(32,33,31,.35)` on the contact card). Glass is the lifted layer: a translucent tint with `blur(18px) saturate(1.6)`, a 1px inner white highlight on the top edge, a warm rim and a two-part shadow. Behind glass, liquid fields (three blurred, slowly morphing orange/ivory blobs) give it something to refract. In dark mode the highlight dims and shadows deepen to pure black.

### Shadow Vocabulary
- **Printed lift** (`box-shadow: 0 30px 60px -40px rgba(32,33,31,.35)`): cards that sit on the page.
- **Glass** (`box-shadow: inset 0 1px 0 rgba(255,255,255,.85), 0 22px 44px -26px rgba(32,33,31,.42), 0 2px 8px -2px rgba(32,33,31,.08)`): every glass panel, the scrolled nav pill, the mobile menu.
- **CTA panel** (`box-shadow: 0 40px 70px -50px rgba(32,33,31,.5)`): the closing call-to-action panel.
- **Mail pill** (`border: 1px solid var(--line)`): the active footer contact, without inactive social destinations.

### Named Rules
**The Glass Means Working Rule.** Glass and liquid fields appear only where the visitor watches something happen or is invited to act (examples, nav on scroll, CTA, help box). A static information card is printed, not glass.

## Shapes

Radius carries meaning. Printed surfaces are square (0). Controls get a slight cut (3px). Tags, chips, rails, the mail pill and the scrolled nav are pills. Glass is the only rounded material (20px, 14px for small glass), and selected liquid tiles soften asymmetrically. Icon buttons (theme, menu) are circles. The footer mail link remains a 44px pill; social links appear only when real profile URLs exist.

## Components

### Buttons
Warm and tactile on a firm base.
- **Shape:** slight cut (3px), 1.5px Carbón border.
- **Primary:** Carbón fill, Papel text, 12px × 24px, 600 weight, 16px; a trailing arrow slides 4px on hover.
- **Hover / Focus:** fill turns Naranja Texto; press scales to 0.98; focus is a 3px Naranja Cauce outline offset 3px.
- **Ghost:** transparent with Carbón border and text.
- **Mini:** 44px tall, 8px × 16px, 14px; the glass "Ver de nuevo" replay uses it with a glass tint.

### Chips
- **Style:** pill, Papel background, Línea Cálida border, 9px × 16px, 650 weight.
- **State:** selected topics turn Naranja Tinte with a Naranja Texto border and text; the problem chips in the Services hero ("Tengo todo en planillas", "Cargo el mismo dato varias veces", "No sé si la IA me sirve") are glass pills that jump to each service's detail.

### Cards / Containers
- **Corner Style:** square for printed cards; 20px for glass panels.
- **Background:** Blanco or Papel for printed; translucent white tint over liquid fields for glass.
- **Shadow Strategy:** Printed lift or Glass, per Elevation & Depth.
- **Border:** Línea Cálida on printed cards; the glass rim on glass.
- **Internal Padding:** 24–40px.

### Inputs / Fields
- **Style:** Papel background, 1.5px Línea Cálida stroke, 3px radius, 13px × 15px.
- **Focus:** border turns Naranja Texto with a soft orange outline.
- **Error:** Naranja Texto border on a Naranja Tinte field, bold error text below.

### Navigation
- **Style:** sticky; at the top a translucent Papel bar, after scrolling a floating glass pill (60px tall, pill radius, blur).
- **Logo:** the Puente Cauce horizontal logo file (216px), color on light, color-dark in dark mode.
- **Tab icon:** the kit's `assets/brand/favicon.svg` (orange bridge on Marfil) on every page.
- **Links:** 15px Carbón Suave; current page in Carbón 600 with a 2px Naranja Cauce underline offset 8px.
- **Actions:** circular theme toggle, primary "Hablemos" button; under 900px a circular menu toggle opens a glass dropdown.

### App example (signature)
A glass stage that tells one short, labelled story ("Ejemplo: distribuidora de bebidas"): a status pill with a dotted spinner, task rows whose sub-status slides to the result and then strikes through, a result card with a three-column table and a file row, and a final "Paranexo terminó" pill. Plays once when it enters the view, has a "Ver de nuevo" replay, and shows the finished state under reduced motion.

### Page hero (shared)
Servicios, Cómo trabajamos and Quiénes somos open with the same hero: a centered mono eyebrow, a Bricolage display title (`clamp(42px, 6.2vw, 92px)`, at most 20ch), a lead in Carbón (max 52ch) and the two CTAs inside a glass cluster, over a quiet liquid field (`--blob-op: .3`). A radial Papel veil behind the copy (90% Papel fading out) keeps the lead at AA while the field moves around it, in both themes. The rules live in `styles/pages.css` under `.hero.page-hero`.

### 404 page
Unknown URLs answer with `404.html` and a 404 status: the shared page hero with "Error 404", "Esta página no existe", "Ir al inicio" and "Escribinos", plus glass chips to Servicios, Cómo trabajamos, Quiénes somos and Preguntas frecuentes. It links from the site root so it works at any depth, carries `noindex` instead of a canonical URL and stays out of the sitemap.

### Service detail (Servicios)
The three main services (Software a medida, Automatizaciones, IA para pymes) each get a detail block: title, lead, "Qué incluye" checklist and "Cómo lo resolvemos" beside a sticky glass example that plays once and offers "Ver de nuevo". These blocks are the only place the services are explained; the former per-service pages now redirect to them (`servicios/#software`, `#automatizaciones`, `#ia`).

### Secondary service tiles ("También hacemos")
Four equal glass tiles in a 2×2 grid (one column under 900px), each with a title, one sentence, a "Consultanos" link and a small looping line glyph in a glass square. Titles start at the top and the link sits at the foot of every tile, so a two-line title never shifts the others. Rows share one height (`grid-auto-rows: 1fr`).

### Process band
On Servicios the process is not repeated: one bordered band asks "¿Cómo sería trabajar juntos?", gives one line (weekly progress, price and scope in writing) and a ghost button to Cómo trabajamos. It stacks under 640px.

### Process bridge (Cómo trabajamos, signature)
The five steps read as a bridge between two banks. On wide screens each step is a column on a shared subgrid: the client's bank on top (a Papel band with what the client does), the deck in the middle (a 3px Naranja Cauce line with a ringed pier dot, the mono step number, the step title and a Naranja Tinte "lo que te llevás" pill pinned to one shared line), and the team's work below in Carbón Suave. A legend under the section lead names the three rows once; each step keeps "Vos" and "Nosotros" for screen readers. Below 1100px the deck turns vertical: a left orange line with the pier dots, and each step stacks title, takeaway, "Vos" panel and "Nosotros" text. The deck line draws in on reveal and is static under reduced motion.

### Paseo del Paraná footer (signature)
The Paseo del Paraná picture spans the top edge and fades into Papel; water ripples and a few lapacho petals fall, paused off screen and static under reduced motion. Below, on solid Papel: logo, tagline, the mail pill, three link columns, and a mono legal row with the Corrientes–Resistencia coordinates.

## Do's and Don'ts

### Do:
- **Do** use Naranja Texto for any orange text and keep Naranja Cauce for fills, graphics and focus.
- **Do** keep printed surfaces square and reserve the 20px glass radius for translucent, working panels.
- **Do** set large headings in Bricolage Grotesque 400 and emphasize with color only.
- **Do** give every animation a finished static state under `prefers-reduced-motion` and pause it off screen.
- **Do** label illustrative data as an example ("Ejemplo", "Datos de ejemplo").
- **Do** keep each service explained in one place (its Servicios detail) and link to that section instead of repeating it on another page.
- **Do** use the logo files from `assets/brand/` at their proportions, with no filters.

### Don't:
- **Don't** use violet-blue gradients, identical icon cards or template section rhythm (generic SaaS).
- **Don't** use institutional blue, office stock photos or a distant corporate tone.
- **Don't** use black backgrounds with neon or terminal aesthetics.
- **Don't** let blue become an interface color.
- **Don't** put text directly on a raw liquid field or on the footer picture; it sits on glass tint or solid Marfil.
- **Don't** recreate the "paranexo" lettering with a font.
