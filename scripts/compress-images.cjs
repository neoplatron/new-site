const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const TARGET_DIRS = [
    path.join(__dirname, '../public/vehicles'),
    path.join(__dirname, '../public/gallery')
];

// Stats for reporting
let totalSavedBytes = 0;
let totalFiles = 0;
let processedFiles = 0;

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function processFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

    const tmpPath = filePath + '.tmp';

    try {
        const stats = fs.statSync(filePath);
        const originalSize = stats.size;

        // Resize large images to max width 1600px (maintains aspect ratio)
        // This effectively reduces file size for massive camera photos
        const buffer = await sharp(filePath)
            .rotate()
            .resize(1600, null, { withoutEnlargement: true })
            .toBuffer();

        let pipeline = sharp(buffer);

        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({ quality: 35, mozjpeg: true });
        } else if (ext === '.png') {
            // PNG compression: palette based is key for size + adaptive filtering
            pipeline = pipeline.png({ quality: 35, compressionLevel: 9, palette: true, adaptiveFiltering: true });
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({ quality: 35 });
        }

        // Write to temp file
        await pipeline.toFile(tmpPath);

        // Check new size
        const newStats = fs.statSync(tmpPath);
        const newSize = newStats.size;

        // Force replacement
        try {
            fs.unlinkSync(filePath); // Delete original
        } catch (e) {
            // Include error if delete fails
        }

        fs.renameSync(tmpPath, filePath); // Move temp to original

        const saved = originalSize - newSize;
        totalSavedBytes += saved;
        processedFiles++;

        const percent = ((newSize / originalSize) * 100).toFixed(1);
        console.log(`Compressed ${path.basename(filePath)}: ${formatBytes(originalSize)} -> ${formatBytes(newSize)} (${percent}%)`);

    } catch (err) {
        console.error(`Error processing ${filePath}: ${err.message}`);
        // Clean up temp if exists
        if (fs.existsSync(tmpPath)) {
            try { fs.unlinkSync(tmpPath); } catch (e) { }
        }
    }
}

async function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            await walk(fullPath);
        } else {
            await processFile(fullPath);
        }
    }
}

async function run() {
    console.log(`Starting compression process...`);
    console.log('Targeting MAX AGGRESSION: Resizing to Max 1600px width & Quality 35.');
    console.log('Directories:', TARGET_DIRS.map(d => path.basename(d)).join(', '));

    for (const dir of TARGET_DIRS) {
        if (fs.existsSync(dir)) {
            console.log(`\nProcessing ${path.basename(dir)}...`);
            await walk(dir);
        } else {
            console.warn(`Directory not found: ${dir}`);
        }
    }

    console.log('------------------------------------------------');
    console.log(`Compression Complete.`);
    console.log(`Processed ${processedFiles} images.`);
    console.log(`Total space saved: ${formatBytes(totalSavedBytes)}`);
}

run();
