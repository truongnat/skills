# Design System — Simple Skills HTML

Sources: Anthropic [`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
+ OpenAI [Apps SDK UI guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines).

**Job:** BA/decision docs — scan, decide, choose. Reading-first. Short `.ss-*`
classes (beauty in CSS). No utility soup.

```yaml
rules:
  reports:
    output_format: html
```

## Dual load mode (mandatory)

HTML artifacts must work in **both** modes:

| Mode | How | What loads |
|---|---|---|
| **Static** | Open the `.html` file directly (editor preview, browser `file://`, or any static host) | Tailwind + anime.js from **CDN tags written into the HTML** |
| **Server** | `session-serve` / decision-server | Same CDNs if present; also serves local `/styles.css`, `/tailwind-theme.js`, `/animate.js`, `/client.js` and records choices |

**Agent rule:** always write the CDN `<script>` tags into the HTML. Do **not**
rely on the server to add them. The server only injects missing tags as a
safety net.

Allowed external CDNs (and only these):

- `https://cdn.tailwindcss.com`
- `https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js`

Local theme/helpers (best-effort for static; always available via server):

- Absolute (server): `/styles.css`, `/tailwind-theme.js`, `/animate.js`, `/client.js`
- Relative from a session file (static): `../../tools/decision-server/styles.css` (and siblings)

Interactive `data-choice` posting still needs the decision server. Viewing and
layout must not depend on the server.

## Design plan (locked)

| Axis | Choice |
|---|---|
| Color | paper `#fff` · wash `#f7f7f8` · ink `#0d0d0d` · mute `#667085` · line `#e5e5e5` · accent `#10a37f` |
| Type | System UI stack (Apps SDK — no custom webfonts) |
| Layout | Reading column ~42–46rem; `.ss-wide` up to 72rem for tables, dashboards, and diagrams |
| Signature | Recommended option: green left rail + filled green CTA |
| Avoid | Purple gradients, grain, double-bezel, cream/serif/terracotta, OLED+acid, broadsheet |

## Agent rules

1. Always include Tailwind CDN + anime.js CDN in every generated HTML head/body.
2. Use `.ss-*` only — do not invent long Tailwind stacks.
3. Semantic: skip → `header` → `main#main.ss-main` → `footer`; one `h1`; ordered `h2`/`h3`.
4. Real `ul`/`ol`/`dl`/`table` (`th scope`); decisions = `role="group"` + `article` + `button[data-choice]`.
5. Anime only for charts/flows (`data-ss-animate`); respect reduced-motion.
6. Use progressive disclosure: summary first, large tables/technical detail later via `.ss-details`.
7. Semantic color communicates module/status only; never rely on color without text.
8. Do not claim “no external assets” — CDN tags are required for static viewing.

## Skeleton

```html
<!doctype html>
<html lang="en" data-ss-theme="enterprise">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>…</title>
  <!-- Required for static + server viewing -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Local theme: relative for static open from .agents/sessions/<task>/ -->
  <script src="../../tools/decision-server/tailwind-theme.js"></script>
  <link rel="stylesheet" href="../../tools/decision-server/styles.css">
  <!-- Absolute paths work when served by decision-server -->
  <script src="/tailwind-theme.js"></script>
  <link rel="stylesheet" href="/styles.css">
</head>
<body class="ss-page">
  <a class="ss-skip" href="#main">Skip to content</a>
  <header class="ss-header"><div class="ss-header-inner">
    <p class="ss-eyebrow">…</p><h1>…</h1><p class="ss-prose">…</p>
  </div></header>
  <main id="main" class="ss-main">…</main>
  <footer class="ss-footer"><div class="ss-footer-inner"><p>…</p></div></footer>

  <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js"></script>
  <script src="../../tools/decision-server/animate.js" defer></script>
  <script src="/animate.js" defer></script>
  <!-- client.js only needed for interactive choice logging via decision-server -->
  <script src="../../tools/decision-server/client.js" defer></script>
  <script src="/client.js" defer></script>
</body>
</html>
```

Duplicate relative + absolute local links are intentional: static open uses the
relative paths; the server uses `/…` and skips reinjecting tags that already
exist.

## Classes

`ss-card` · `ss-h2` · `ss-prose` · `ss-overview` · `ss-stats`/`ss-stat` ·
`ss-table-wrap`/`ss-table` · `ss-grid` · `ss-wide` · `ss-nav` · `ss-flow` ·
`ss-toolbar` · `ss-details` · `ss-badge` (`info`/`module`/`pk`/`fk`/status) ·
`ss-options`/`ss-option`/`ss-tag` (+ `recommended`) · `ss-chart` · `ss-code` ·
`ss-ok`/`ss-warn`/`ss-bad`/`ss-accent` · `ss-sr-only`

```html
<section class="ss-card" aria-labelledby="s1">
  <h2 id="s1">Executive summary</h2>
  <ul class="ss-prose">…</ul>
</section>

<figure class="ss-chart" data-ss-animate="bars">
  <svg>…<rect data-ss-bar data-ss-to="240" width="0"></svg>
</figure>
```

Animate: `bars` | `steps` | `pulse`.

## Host product override

- Primary documentation: `<path-or-url>`
- UI/component library: `<path-or-url>`
- Design tokens/theme: `<path-or-url>`
- Assets/icons: `<path-or-url>`
- Framework: `<framework-or-not-applicable>`
- Required conventions: `<short-summary-or-none>`
- Exceptions: `<known-exceptions-or-none>`
