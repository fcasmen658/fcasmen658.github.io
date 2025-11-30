const fs = require('fs');
const path = require('path');

// Simple image optimization using Canvas API (no external deps)
// For WebP conversion, we'll use a different approach

const images = [
  'DIW/TareaOnline_03/images/tacos.jpeg',
  'DIW/TareaOnline_03/images/mesas.png',
  'DIW/TareaOnline_03/images/hero.jpg'
];

console.log('Para convertir a WebP necesitas instalar sharp:');
console.log('npm install sharp --no-save');
console.log('');
console.log('O usa este comando de PowerShell para cada imagen:');
console.log('');

images.forEach(img => {
  const parsed = path.parse(img);
  const outputWebP = path.join(parsed.dir, parsed.name + '.webp');
  console.log(`# ${img} -> ${outputWebP}`);
  console.log(`# Requiere ImageMagick o herramienta externa`);
});

// Intentar con sharp si está disponible
try {
  const sharp = require('sharp');
  
  (async () => {
    console.log('\n✓ Sharp detectado, convirtiendo imágenes...\n');
    
    for (const img of images) {
      const parsed = path.parse(img);
      const outputWebP = path.join(parsed.dir, parsed.name + '.webp');
      
      console.log(`Procesando ${img}...`);
      
      const inputPath = path.resolve(img);
      const outputPath = path.resolve(outputWebP);
      
      if (!fs.existsSync(inputPath)) {
        console.log(`  ⚠ No encontrado: ${inputPath}`);
        continue;
      }
      
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`  ✓ ${path.basename(outputWebP)}: ${(originalSize/1024).toFixed(1)} KB -> ${(newSize/1024).toFixed(1)} KB (${savings}% reducción)`);
    }
    
    console.log('\n✓ Conversión completada');
  })();
  
} catch (err) {
  console.log('\n⚠ Sharp no disponible. Instala con: npm install sharp --no-save');
  process.exit(1);
}
