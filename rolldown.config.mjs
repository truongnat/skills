import { defineConfig } from "rolldown";
import { globSync } from "glob";
import path from "node:path";

const toolInputs = Object.fromEntries(
  globSync("tools/**/*.ts").map((file) => {
    const name = path
      .relative("tools", file)
      .replace(/\\/g, "/")
      .replace(/\.ts$/, "");
    return [name, file];
  }),
);

const toolingInputs = Object.fromEntries(
  globSync("src/tooling/**/*.ts").map((file) => {
    const name = path
      .relative("src/tooling", file)
      .replace(/\\/g, "/")
      .replace(/\.ts$/, "");
    return [`tooling/${name}`, file];
  }),
);

export default defineConfig([
  {
    input: "src/cli.ts",
    output: {
      file: "dist/cli.js",
      format: "esm",
      banner: "#!/usr/bin/env node",
    },
    platform: "node",
    external: [/^node:/],
  },
  {
    input: { ...toolInputs, ...toolingInputs },
    output: {
      dir: "dist/tools",
      format: "esm",
      entryFileNames: "[name].js",
    },
    platform: "node",
    external: [/^node:/],
  },
]);
