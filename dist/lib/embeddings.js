export function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter(Boolean);
}
function hashToken(token) {
    let h = 2166136261;
    for (let i = 0; i < token.length; i++) {
        h ^= token.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
export function embedText(text, dims = 256) {
    const v = new Array(dims).fill(0);
    const tokens = tokenize(text);
    if (tokens.length === 0)
        return v;
    for (const t of tokens) {
        const h = hashToken(t);
        const idx = h % dims;
        v[idx] += 1;
    }
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    if (norm > 0) {
        for (let i = 0; i < v.length; i++)
            v[i] /= norm;
    }
    return v;
}
export function cosine(a, b) {
    const n = Math.min(a.length, b.length);
    let s = 0;
    for (let i = 0; i < n; i++)
        s += a[i] * b[i];
    return s;
}
