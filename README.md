# Keithston & Partners: Modern Restaurant Website

HTML, CSS and JavaScript only. No build step.

## Run
Open `index.html` in a browser, or use VS Code Live Server.

## Files
- `index.html`: page structure and content
- `style.css`: design tokens, layout, animations, responsive rules
- `script.js`: menu, header behaviour, scroll reveals, menu photo preview, form

## Design
- Palette: ink #0F1511, basil #1C3326, limestone #E9E6DD, paper #F5F3EE, pomodoro #C63D24
- Type: Instrument Serif (headlines) and Hanken Grotesk (text), loaded from Google Fonts

## Animations
- Hero: headline lines rise in, photo zooms out slowly, then parallax on scroll
- Header: turns solid on scroll, hides on scroll down, returns on scroll up
- Sections: text and list rows reveal in sequence, photos wipe open
- Menu: hovering a dish fills the row and a photo follows the cursor (touch screens show thumbnails)
- Mobile menu: circular reveal
- Respects `prefers-reduced-motion`

## Images
Photos are remote Unsplash URLs. Replace them with local files for an offline version.
