import { existsSync, copyFileSync } from "fs";

const src = ".env.example";
const dest = ".env";

if (!existsSync(dest)) {
  copyFileSync(src, dest);
  console.log("✅ .env created from .env.example");
} else {
  console.log("ℹ️ .env file already exists, skipping");
}
