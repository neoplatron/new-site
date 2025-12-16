
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WORSPACE ROOT (Approximated from script location)
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

const GALLERY_JSON_PATH = path.join(WORKSPACE_ROOT, 'src/data/galleryData.json');
const UNCATEGORIZED_DIR_REL = 'public/gallery/Uncategorized/Uncategorized';
const UNCATEGORIZED_DIR_ABS = path.join(WORKSPACE_ROOT, UNCATEGORIZED_DIR_REL);

async function renameImages() {
    console.log(`Working directory: ${UNCATEGORIZED_DIR_ABS}`);

    if (!fs.existsSync(UNCATEGORIZED_DIR_ABS)) {
        console.error("Uncategorized directory not found!");
        return;
    }

    // 1. Read existing files
    const files = fs.readdirSync(UNCATEGORIZED_DIR_ABS)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .sort(); // Sort to ensure deterministic order

    console.log(`Found ${files.length} files to rename.`);

    const newPaths = [];

    // 2. Rename files
    files.forEach((file, index) => {
        const ext = path.extname(file);
        const newName = `${index + 1}${ext}`; // 1.jpg, 2.png, etc.
        const oldPath = path.join(UNCATEGORIZED_DIR_ABS, file);
        const newPath = path.join(UNCATEGORIZED_DIR_ABS, newName);

        // Rename file
        // Note: Check if target exists to avoid overwriting if running multiple times, 
        // though strictly we are mapping old->new. 
        // If "1.jpg" already exists (from a previous run), we might have a collision if we aren't careful.
        // But since the original names are hashes, collisions with "1.jpg" are unlikely unless mixed.
        // We will assume a clean state or that the user wants this done once.
        if (file !== newName) {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed: ${file} -> ${newName}`);
        } else {
            console.log(`Skipped: ${file} (Already named correctly)`);
        }

        // Store new relative path for JSON
        // Web path format: /gallery/Uncategorized/Uncategorized/1.jpg
        const webPath = `/gallery/Uncategorized/Uncategorized/${newName}`;
        newPaths.push(webPath);
    });

    // 3. Update galleryData.json
    if (fs.existsSync(GALLERY_JSON_PATH)) {
        const jsonData = JSON.parse(fs.readFileSync(GALLERY_JSON_PATH, 'utf-8'));

        if (jsonData["Uncategorized"] && jsonData["Uncategorized"]["Uncategorized"]) {
            jsonData["Uncategorized"]["Uncategorized"] = newPaths;

            fs.writeFileSync(GALLERY_JSON_PATH, JSON.stringify(jsonData, null, 2));
            console.log(`Updated galleryData.json with ${newPaths.length} entries.`);
        } else {
            console.error("Could not find Uncategorized section in galleryData.json");
        }
    } else {
        console.error("galleryData.json not found!");
    }

    console.log("Done!");
}

renameImages();
