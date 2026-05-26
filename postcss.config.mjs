import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.join(projectRoot, "src");

export default {
  plugins: {
    "@tailwindcss/postcss": {
      base: sourceRoot,
    },
  },
};
