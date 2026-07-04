#!/usr/bin/env node
const { writeFile, mkdir, stat, copyFile, readdir, cp } = require('fs/promises')


async function main() {

    console.log("Installing skills...");

    // check .agents
    if (!(await stat('.agents').catch(() => false))) {
        await mkdir('.agents', { recursive: true });
    }

    // copy all skills to .agents

    const skills = await readdir('skills');

    console.log(`Found ${skills.length} skills.`);

    for (const skill of skills) {
        // copy recursively
        console.log(`Installing skill ${skill} ...`);

        await cp(
            `skills/${skill}`,
            `.agents/skills/${skill}`,
            {
                recursive: true,
                errorOnExist: false
            }
        );

    }

    await cp(
        'docs/design-system.md',
        '.agents/design-system.md',
        { errorOnExist: false }
    );

    await cp(
        'docs/AGENTS.md',
        '.agents/AGENTS.md',
        { errorOnExist: false }
    );


    console.log("Skills installed successfully.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});