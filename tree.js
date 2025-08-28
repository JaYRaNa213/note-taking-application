// tree.js
import fs from "fs";
import path from "path";

const ignoreFolders = ["node_modules", ".git", "dist", "build"]; // ignored folders

function generateTree(dir, prefix = "") {
  let result = "";
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    const fullPath = path.join(dir, file);
    const isLast = index === files.length - 1;
    const stats = fs.statSync(fullPath);

    // Ignore unwanted folders
    if (ignoreFolders.includes(file)) return;

    result += `${prefix}${isLast ? "└── " : "├── "}${file}\n`;

    if (stats.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      result += generateTree(fullPath, newPrefix);
    }
  });

  return result;
}

const rootDir = process.cwd(); // run in project root
const tree = generateTree(rootDir);

fs.writeFileSync("tree.txt", tree, "utf-8");

console.log("✅ Project tree written to tree.txt (ignoring node_modules)");
