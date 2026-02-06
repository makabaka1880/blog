import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: pnpm new:article \"Title Here\"");
  process.exit(1);
}

const title = args.join(" ").trim();
if (!title) {
  console.error("Error: title is empty.");
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .replace(/--+/g, "-");

if (!slug) {
  console.error("Error: title must include letters or numbers.");
  process.exit(1);
}

const now = new Date();
const yy = String(now.getFullYear()).slice(-2);
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");
const yymmdd = `${yy}${mm}${dd}`;
const isoDate = `${now.getFullYear()}-${mm}-${dd}`;

const filename = `${yymmdd}-${slug}.md`;
const targetDir = path.join(process.cwd(), "content", "article");
const targetPath = path.join(targetDir, filename);

if (fs.existsSync(targetPath)) {
  console.error(`Error: file already exists: ${targetPath}`);
  process.exit(1);
}

const frontmatter = [
  "---",
  `title: ${title}`,
  "description: TODO",
  `createTime: ${isoDate}`,
  `updateTime: ${isoDate}`,
  "---",
  "",
  "# TODO",
  "",
].join("\n");

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetPath, frontmatter, "utf8");

console.log(`Created ${targetPath}`);
