const fs = require('fs');
const path = require('path');

const VEHICLES_DIR = path.join(__dirname, '../public/vehicles');
const OUTPUT_FILE = path.join(__dirname, '../src/data/galleryData.json');

// Helper to get thumbnail from a directory
function getThumbnail(dirPath, relativePath) {
    if (!fs.existsSync(dirPath)) return null;
    const files = fs.readdirSync(dirPath);
    // 1. Look for explicit thumbnail
    const thumb = files.find(f => f.toLowerCase().startsWith('thumbnail.'));
    if (thumb) return `/vehicles/${relativePath}/${thumb}`.replace(/\\/g, '/');

    return null;
}

// Helper to find the first image in a deep hierarchy to use as a fallback thumbnail
function findFirstImage(dirPath, relativePath) {
    if (!fs.existsSync(dirPath)) return null;
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    // 1. Check for images in current dir
    const image = items.find(i => !i.isDirectory() && /\.(jpg|jpeg|png|webp)$/i.test(i.name) && !i.name.toLowerCase().startsWith('thumbnail.'));
    if (image) return `/vehicles/${relativePath}/${image.name}`.replace(/\\/g, '/');

    // 2. Check subdirectories
    const subDirs = items.filter(i => i.isDirectory());
    for (const sub of subDirs) {
        const found = findFirstImage(path.join(dirPath, sub.name), relativePath ? `${relativePath}/${sub.name}` : sub.name);
        if (found) return found;
    }
    return null;
}

// Recursive function to build hierarchy
// Level 0: Root -> Categories (2 Wheeler, 4 Wheeler)
// Level 1: Category -> Brands (Hyundai, Tata)
// Level 2: Brand -> Models (i10, Nexon)
// Level 3: Model -> Images
// Recursive function to build hierarchy
// Level 0: Root -> Categories (2 Wheeler, 4 Wheeler)
// Level 1: Category -> Brands (Hyundai, Tata)
// Level 2: Brand -> Models (i10, Nexon)
// Level 3: Model -> Images
function buildHierarchy(dirPath, relativePath = '', depth = 0) {
    if (!fs.existsSync(dirPath)) return [];

    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    // Filter directories only
    const subDirs = items.filter(i => i.isDirectory());

    // If no subdirectories, we might be at the bottom level (Model), containing images
    if (subDirs.length === 0) {
        // Collect images (excluding thumbnail)
        const files = items
            .filter(i => !i.isDirectory() && /\.(jpg|jpeg|png|webp)$/i.test(i.name))
            .map(i => i.name)
            .filter(name => !name.toLowerCase().startsWith('thumbnail.'));

        return {
            type: 'model_content',
            images: files.map(f => `/vehicles/${relativePath}/${f}`.replace(/\\/g, '/'))
        };
    }

    // Process Subdirectories
    return subDirs.map(subDir => {
        const currentRelative = relativePath ? `${relativePath}/${subDir.name}` : subDir.name;
        const fullPath = path.join(dirPath, subDir.name);

        // Recurse first to build children. Increment depth.
        const children = buildHierarchy(fullPath, currentRelative, depth + 1);

        // Determine thumbnail.
        // Depth 0 (Category) & Depth 1 (Brand): Strict (Only use explicit thumbnail)
        // Depth 2+ (Model): Fallback allowed (findFirstImage)
        let thumb = getThumbnail(fullPath, currentRelative);

        if (!thumb && depth >= 2) {
            thumb = findFirstImage(fullPath, currentRelative);
        }

        return {
            name: subDir.name,
            thumbnail: thumb,
            children: children
        };
    });
}

function generate() {
    console.log('Generating Gallery Data...');
    if (!fs.existsSync(VEHICLES_DIR)) {
        console.error('Error: public/vehicles directory not found!');
        process.exit(1);
    }

    const hierarchy = buildHierarchy(VEHICLES_DIR);

    const outputContent = JSON.stringify(hierarchy, null, 2);
    fs.writeFileSync(OUTPUT_FILE, outputContent);
    console.log(`Gallery data written to ${OUTPUT_FILE}`);
}

generate();
