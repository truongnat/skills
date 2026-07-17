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

Serve via `session-serve` (not `file://`). Runtime may inject
`cdn.tailwindcss.com`, `/tailwind-theme.js`, `/styles.css`, `animejs@3.2.2`,
`/animate.js`, `/client.js`.

## Design plan (locked)

| Axis | Choice |
|---|---|
| Color | paper `#fff` · wash `#f7f7f8` · ink `#0d0d0d` · mute `#667085` · line `#e5e5e5` · accent `#10a37f` |
| Type | System UI stack (Apps SDK — no custom webfonts) |
| Layout | Reading column ~42–46rem; `.ss-wide` up to 72rem for tables, dashboards, and diagrams |
| Signature | Recommended option: green left rail + filled green CTA |
| Avoid | Purple gradients, grain, double-bezel, cream/serif/terracotta, OLED+acid, broadsheet |

## Agent rules

1. Use `.ss-*` only — do not invent long Tailwind stacks.
2. Semantic: skip → `header` → `main#main.ss-main` → `footer`; one `h1`; ordered `h2`/`h3`.
3. Real `ul`/`ol`/`dl`/`table` (`th scope`); decisions = `role="group"` + `article` + `button[data-choice]`.
4. Anime only for charts/flows (`data-ss-animate`); respect reduced-motion.
5. Use progressive disclosure: summary first, large tables/technical detail later via `.ss-details`.
6. Semantic color communicates module/status only; never rely on color without text.

## Skeleton

```html
<body class="ss-page">
  <a class="ss-skip" href="#main">Skip to content</a>
  <header class="ss-header"><div class="ss-header-inner">
    <p class="ss-eyebrow">…</p><h1>…</h1><p class="ss-prose">…</p>
  </div></header>
  <main id="main" class="ss-main">…</main>
  <footer class="ss-footer"><div class="ss-footer-inner"><p>…</p></div></footer>
</body>
```

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
