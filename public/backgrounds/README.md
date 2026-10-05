# Static background captures

These WebP files are captures of the actual installed library components, with
the presets in `components/portfolio/section-background.tsx`. They are the
no-JavaScript, reduced-motion, loading and WebGL-failure fallback, not substitute
shaders or hand-drawn backgrounds.

Regenerate after changing a preset: build the application, then run
`node scripts/capture-portfolio-backgrounds.mjs`. This requires Google Chrome
(or the executable specified by `CHROME_PATH`) and uses a temporary local server.
