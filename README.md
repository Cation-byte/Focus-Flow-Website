# Focus Flow — Landing Website

The marketing / landing page for **Focus Flow** (`Focus Flow` is the AI-powered productivity and
study workspace). Static HTML, CSS and vanilla JS — no build step, no dependencies.

```
Focus Flow Landing Web Page/
├─ index.html        page markup (logos, hero, all feature sections, CTAs)
├─ styles.css        theme + the Focus Flow / KIRO logo animations
├─ script.js         scroll reveals, live clock, demo timers, flashcard flip
└─ assets/
   └─ favicon.svg    the Focus Flow mark
```

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 8000
```

## The two buttons

| Button | Behaviour |
| --- | --- |
| **Open the web app** | Live link → https://focus-flow-q9qx.onrender.com |
| **Download for Windows** | Visibly **disabled** with a "Coming soon" chip (no link yet) |

The **Android app** is called out as *under progress / coming soon* in the hero, the platform
section and the footer.

## Branding notes

- The Focus Flow logo animates exactly like the app: the stroke draws itself (path-length
  normalised), then the spark springs in and pulses.
- The KIRO mark uses the same concentric-ring animation as `src/components/KiroLogo.tsx` — 9s of
  slow drift followed by a 1s burst, plus the breathing core and energy glow. Hover the badge to
  flip it into its faster "thinking" state.
- Type: Space Grotesk (display) / Inter (body) / Playfair Display (accents), matching the app.

## Hosting

Any static host works (GitHub Pages, Netlify, Vercel, Render static site). Publish the folder as
the site root.
