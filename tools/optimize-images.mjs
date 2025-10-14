// client/tools/optimize-images.mjs
import sharp from "sharp";
import { globSync } from "glob"; // ← named import
import { mkdirp } from "mkdirp";
import { basename, extname, join } from "node:path";

// READ originals from public/assets/images (gallery1.jpg … gallery8.jpg)
const INPUT_GLOB = "public/assets/images/gallery{1,2,3,4,5,6,7,8}.jpg";

// WRITE optimized copies to public/gallery/
const OUT_DIR = "public/gallery";

// Three useful widths
const SIZES = [
  { name: "sm", width: 600 },
  { name: "md", width: 1200 },
  { name: "lg", width: 2000 },
];

// Balanced quality targets
const Q = { avif: 50, webp: 65, jpg: 78 };

const files = globSync(INPUT_GLOB, { nocase: true });
if (!files.length) {
  console.error(
    "No files found. Expected public/assets/images/gallery1.jpg … gallery8.jpg"
  );
  process.exit(1);
}

await mkdirp(OUT_DIR);

for (const file of files) {
  const base = basename(file, extname(file)); // e.g., "gallery1"
  const pipe = sharp(file).rotate(); // auto-fix orientation

  for (const s of SIZES) {
    const r = pipe.clone().resize({ width: s.width, withoutEnlargement: true });

    await r
      .clone()
      .avif({ quality: Q.avif, effort: 4 })
      .toFile(join(OUT_DIR, `${base}-${s.name}.avif`));

    await r
      .clone()
      .webp({ quality: Q.webp, effort: 4 })
      .toFile(join(OUT_DIR, `${base}-${s.name}.webp`));

    await r
      .clone()
      .jpeg({ quality: Q.jpg, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(join(OUT_DIR, `${base}-${s.name}.jpg`));
  }
  console.log("✓ processed", base);
}

console.log("All done. Outputs in public/gallery/");