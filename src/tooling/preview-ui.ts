type CardOptions = {
  body: string;
  header?: string;
  className?: string;
};

export function renderHero(options: {
  title: string;
  description?: string;
  meta?: string;
}): string {
  return `
    <section class="hero">
      <h1>${options.title}</h1>
      ${options.description ? `<p class="muted">${options.description}</p>` : ""}
      ${options.meta ? `<div class="actions">${options.meta}</div>` : ""}
    </section>
  `;
}

export function renderCard(options: CardOptions): string {
  return `
    <section class="card${options.className ? ` ${options.className}` : ""}">
      ${options.header ? options.header : ""}
      ${options.body}
    </section>
  `;
}

export function renderCardHeader(left: string, right?: string): string {
  return `
    <div class="card-header">
      <div class="stack">${left}</div>
      ${right ?? ""}
    </div>
  `;
}

export function renderSectionTitle(content: string, trailing?: string): string {
  return `
    <div class="section-title">
      <div class="actions">${content}</div>
      ${trailing ?? ""}
    </div>
  `;
}

export function renderBadge(text: string): string {
  return `<span class="badge">${text}</span>`;
}

export function renderToolbar(content: string): string {
  return `<div class="toolbar">${content}</div>`;
}

export function renderScrollFrame(content: string): string {
  return `<div class="scroll-frame">${content}</div>`;
}

export function renderField(label: string, control: string): string {
  return `<label class="field"><span class="field-label">${label}</span>${control}</label>`;
}
