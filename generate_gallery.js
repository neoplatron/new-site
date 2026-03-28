import fs from 'fs';
import path from 'path';

const publicVehiclesPath = path.join(process.cwd(), 'public', 'vehicles');
const outputPath = path.join(process.cwd(), 'src', 'data', 'galleryData.json');

function processDir(dirPath, webPathBase) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  const directories = entries.filter(e => e.isDirectory());
  const files = entries.filter(e => e.isFile());

  // find thumbnail
  let thumbnail = entries.find(e => e.name.toLowerCase().startsWith('thumbnail.'));
  if (!thumbnail) {
    // fallback to some common image names
    thumbnail = entries.find(e => e.name === '1.jpg' || e.name === 'A.jpg');
  }
  if (!thumbnail && files.length > 0) {
    // fallback to first valid image
    thumbnail = files.find(e => e.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|jfif|gif)$/));
  }

  const thumbWebPath = thumbnail ? `${webPathBase}/${thumbnail.name}` : '';

  if (directories.length > 0) {
    const children = directories.map(d => {
       return processDir(path.join(dirPath, d.name), `${webPathBase}/${d.name}`);
    });
    return {
      name: path.basename(dirPath),
      thumbnail: thumbWebPath,
      children: children
    };
  } else {
    // Leaf node, only images
    const images = files
        .filter(e => !e.name.toLowerCase().startsWith('thumbnail.') && e.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|jfif|gif)$/))
        .map(e => `${webPathBase}/${e.name}`);
    
    // In original code, the leaf node was returned as { name, thumbnail, children: { type: "model_content", images } }
    return {
      name: path.basename(dirPath),
      thumbnail: thumbWebPath,
      children: {
        type: "model_content",
        images: images
      }
    };
  }
}

const rootEntries = fs.readdirSync(publicVehiclesPath, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => processDir(path.join(publicVehiclesPath, e.name), `/vehicles/${e.name}`));

fs.writeFileSync(outputPath, JSON.stringify(rootEntries, null, 2));
console.log('Saved to', outputPath);
