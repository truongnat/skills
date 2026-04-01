import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import matter from 'gray-matter';
export function listSkillDirs(repoRoot, includeTemplate = false) {
    const skillsRoot = resolve(repoRoot, 'skills');
    if (!existsSync(skillsRoot))
        return [];
    const out = [];
    for (const entry of readdirSync(skillsRoot, { withFileTypes: true })) {
        if (!entry.isDirectory())
            continue;
        if (!includeTemplate && entry.name === 'examples')
            continue;
        const skillMd = join(skillsRoot, entry.name, 'SKILL.md');
        if (existsSync(skillMd))
            out.push(join(skillsRoot, entry.name));
    }
    if (includeTemplate) {
        const template = join(skillsRoot, 'examples', 'skill-template');
        if (existsSync(join(template, 'SKILL.md')))
            out.push(template);
    }
    return out.sort();
}
export function readSkillInfo(dir) {
    const skillMd = join(dir, 'SKILL.md');
    const folder = dir.split(/[\\/]/).pop() || dir;
    if (!existsSync(skillMd)) {
        return { folder, path: dir, hasSkillMd: false };
    }
    const raw = readFileSync(skillMd, 'utf8');
    const parsed = matter(raw);
    const name = typeof parsed.data.name === 'string' ? parsed.data.name.trim() : undefined;
    const description = typeof parsed.data.description === 'string' ? parsed.data.description.trim() : undefined;
    return { folder, path: dir, hasSkillMd: true, name, description, content: parsed.content };
}
