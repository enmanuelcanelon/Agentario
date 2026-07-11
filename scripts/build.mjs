import { spawnSync } from "node:child_process";

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
    shell: true,
  });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runNextBuild() {
  run("npm", ["run", "export:catalog"]);
  run("npx", ["next", "build"]);
}

const isOpenNextChild = process.env.OPEN_NEXT_BUILDING === "1";
const isCloudflareCI =
  process.env.CF_PAGES === "1" ||
  process.cwd().startsWith("/opt/buildhome") ||
  (Boolean(process.env.CI) && Boolean(process.env.CLOUDFLARE_ACCOUNT_ID));

if (isOpenNextChild) {
  // Called by `opennextjs-cloudflare build` — only build Next.js.
  runNextBuild();
  process.exit(0);
}

if (isCloudflareCI) {
  // Cloudflare Workers Builds runs `npm run build` then `wrangler deploy`.
  // Produce the `.open-next` bundle so deploy finds the compiled config.
  run("npx", ["opennextjs-cloudflare", "build"], {
    ...process.env,
    OPEN_NEXT_BUILDING: "1",
  });
  process.exit(0);
}

runNextBuild();
