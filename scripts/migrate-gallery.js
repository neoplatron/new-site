
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const SOURCE_DIR = 'C:/Users/rahma/Downloads/Neoplatron Site/Old Site Files/gimg';
const TARGET_PUBLIC_DIR = 'C:/Users/rahma/Downloads/Neoplatron Site/public/gallery';
const TARGET_DATA_FILE = 'C:/Users/rahma/Downloads/Neoplatron Site/src/data/galleryData.json';

// CATEGORY MAPPING HEURISTICS
const CATEGORY_RULES = [
    { contains: 'BUS', category: '6 Wheelers' },
    { contains: 'TRUCK', category: '6 Wheelers' },
    { contains: 'AUTO', category: '3 Wheelers' },
    { contains: 'BIKE', category: '2 Wheelers' },
    { contains: 'SCOOTER', category: '2 Wheelers' },
];

const DEFAULT_CATEGORY = '4 Wheelers'; // Most are cars

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function cleanModelName(name) {
    // Remove trailing numbers (timestamps) or " D" / " PETROL" suffixes roughly
    let clean = name.replace(/[0-9]+$/, '').trim(); // Remove trailing timestamp
    clean = clean.replace(/ D$/, '').trim(); // Remove " D" suffix (Diesel)
    clean = clean.replace(/ AT$/, '').trim(); // Remove " AT" suffix
    clean = clean.replace(/ MH$/, '').trim(); // Remove " MH" suffix
    clean = clean.replace(/ 1$/, '').trim(); // Remove " 1" suffix
    clean = clean.replace(/TYPE [0-9]/, '').trim(); 
    return clean;
}

function getCategory(modelName) {
    const upper = modelName.toUpperCase();
    for (const rule of CATEGORY_RULES) {
        if (upper.includes(rule.contains)) {
            return rule.category;
        }
    }
    return DEFAULT_CATEGORY;
}

async function migrate() {
    console.log('Starting migration...');
    
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`Source directory not found: ${SOURCE_DIR}`);
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR);
    const galleryData = {};

    let count = 0;

    for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png|gif)$/i)) continue;

        let modelName = 'Uncategorized';
        let category = 'Uncategorized';

        // Check if file is a hash (32 chars hex + extension)
        const isHash = /^[a-f0-9]{32}\./i.test(file);

        if (!isHash) {
            // Extract Name part before the long timestamp number
            // Example: HONDA CITY1528532708.jpg -> HONDA CITY
            const match = file.match(/^(.+?)[0-9]{10,}\./);
            if (match) {
                let rawName = match[1];
                modelName = cleanModelName(rawName);
                category = getCategory(modelName);
            }
        }

        // Prepare Target Paths
        const categoryDir = path.join(TARGET_PUBLIC_DIR, category);
        const modelDir = path.join(categoryDir, modelName);
        
        ensureDir(modelDir);

        // Copy File
        const sourcePath = path.join(SOURCE_DIR, file);
        const targetPath = path.join(modelDir, file);
        fs.copyFileSync(sourcePath, targetPath);

        // Update JSON Data
        if (!galleryData[category]) galleryData[category] = {};
        if (!galleryData[category][modelName]) galleryData[category][modelName] = [];
        
        // Path relative to public for React
        // Windows path separator replacement
        // Note: We need forward slashes for URLs
        const webPath = `/gallery/${category}/${modelName}/${file}`;
        galleryData[category][modelName].push(webPath);

        count++;
    }

    // Write JSON
    ensureDir(path.dirname(TARGET_DATA_FILE));
    fs.writeFileSync(TARGET_DATA_FILE, JSON.stringify(galleryData, null, 2));

    console.log(`Migration complete! Processed ${count} images.`);
    console.log(`Data written to ${TARGET_DATA_FILE}`);
}

migrate();
