
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

const GALLERY_JSON_PATH = path.join(WORKSPACE_ROOT, 'src/data/galleryData.json');
const PUBLIC_GALLERY_DIR = path.join(WORKSPACE_ROOT, 'public/gallery');
const UNCATEGORIZED_DIR = path.join(PUBLIC_GALLERY_DIR, 'Uncategorized/Uncategorized');

// User Input Config
const DELETE_IDS = [1, 4, 12, 14, 19, 24, 26, 30, 33, 34, 36, 38, 40, 45];
const RENAULT_IDS = [2, 3, 6, 8, 9, 10, 11, 17, 20, 21, 23, 25, 27, 28, 29, 31, 39, 41, 42]; // Renault Kwid 1L Petrol (4W)
const HYUNDAI_IDS = [5, 7, 13, 15, 16, 18, 22, 32, 35, 37, 43, 44]; // Hyundai Verna 1.6 XXI Petrol (4W)

const MISCATEGORIZED_MODEL = "PETROL + LPG WITH KIT"; // Move from 4W to 3W

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function findFile(id) {
    // Try jpg and png
    const extensions = ['.jpg', '.jpeg', '.png', '.gif'];
    for (const ext of extensions) {
        const filePath = path.join(UNCATEGORIZED_DIR, `${id}${ext}`);
        if (fs.existsSync(filePath)) return filePath;
    }
    return null;
}

function moveFile(id, category, model, collectionArray) {
    const srcPath = findFile(id);
    if (!srcPath) {
        console.warn(`File for ID ${id} not found.`);
        return;
    }

    const filename = path.basename(srcPath);
    const targetDir = path.join(PUBLIC_GALLERY_DIR, category, model);
    const targetPath = path.join(targetDir, filename);

    ensureDir(targetDir);

    // Move file
    try {
        fs.renameSync(srcPath, targetPath);
        console.log(`Moved ${filename} to ${category}/${model}`);

        // Add to collection
        const webPath = `/gallery/${category}/${model}/${filename}`;
        collectionArray.push(webPath);
    } catch (err) {
        console.error(`Error moving ${filename}:`, err);
    }
}

async function organize() {
    console.log("Starting final organization...");

    if (!fs.existsSync(GALLERY_JSON_PATH)) {
        console.error("galleryData.json not found!");
        return;
    }

    const jsonData = JSON.parse(fs.readFileSync(GALLERY_JSON_PATH, 'utf-8'));

    // 1. Handle Deletions
    console.log("Deleting unwanted files...");
    DELETE_IDS.forEach(id => {
        const filePath = findFile(id);
        if (filePath) {
            fs.unlinkSync(filePath);
            console.log(`Deleted ID ${id}`);
        }
    });

    // 2. Organization Arrays
    const renaultImages = [];
    const hyundaiImages = [];

    // 3. Move files
    RENAULT_IDS.forEach(id => moveFile(id, "4 Wheelers", "Renault Kwid 1L Petrol", renaultImages));
    HYUNDAI_IDS.forEach(id => moveFile(id, "4 Wheelers", "Hyundai Verna 1.6 XXI Petrol", hyundaiImages));

    // 4. Update JSON Data

    // A. Add new mappings
    if (!jsonData["4 Wheelers"]) jsonData["4 Wheelers"] = {};
    jsonData["4 Wheelers"]["Renault Kwid 1L Petrol"] = renaultImages;
    jsonData["4 Wheelers"]["Hyundai Verna 1.6 XXI Petrol"] = hyundaiImages;

    // B. Fix Miscategorized "PETROL + LPG WITH KIT"
    if (jsonData["4 Wheelers"][MISCATEGORIZED_MODEL]) {
        if (!jsonData["3 Wheelers"]) jsonData["3 Wheelers"] = {};

        // Move images physically? 
        // The previous script put them in /gallery/4 Wheelers/PETROL...
        // We should move the folder too.
        const oldModelDir = path.join(PUBLIC_GALLERY_DIR, "4 Wheelers", MISCATEGORIZED_MODEL);
        const newModelDir = path.join(PUBLIC_GALLERY_DIR, "3 Wheelers", MISCATEGORIZED_MODEL);

        if (fs.existsSync(oldModelDir)) {
            ensureDir(path.dirname(newModelDir)); // ensure 3 Wheelers exists
            fs.renameSync(oldModelDir, newModelDir);
            console.log(`Moved folder ${MISCATEGORIZED_MODEL} to 3 Wheelers`);
        }

        // Update JSON paths
        const oldPaths = jsonData["4 Wheelers"][MISCATEGORIZED_MODEL];
        const newPaths = oldPaths.map(p => p.replace("/4 Wheelers/", "/3 Wheelers/"));
        jsonData["3 Wheelers"][MISCATEGORIZED_MODEL] = newPaths;

        // Remove from 4W
        delete jsonData["4 Wheelers"][MISCATEGORIZED_MODEL];
    }

    // C. Remove Uncategorized
    delete jsonData["Uncategorized"];

    // 5. Cleanup Empty Dirs (Optional but good)
    // We try to remove the Uncategorized root if empty
    try {
        fs.rmSync(path.join(PUBLIC_GALLERY_DIR, 'Uncategorized'), { recursive: true, force: true });
    } catch (e) { console.log("Could not remove Uncategorized dir entirely", e); }


    // 6. Save JSON
    fs.writeFileSync(GALLERY_JSON_PATH, JSON.stringify(jsonData, null, 2));
    console.log("Organization complete! galleryData.json updated.");
}

organize();
