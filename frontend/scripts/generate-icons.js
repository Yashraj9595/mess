const fs = require('fs');
const path = require('path');

// Create a simple SVG icon that can be converted to PNG
const createIconSVG = (size) => {
  const color = '#3b82f6'; // Blue color matching theme
  const text = 'MA'; // Mess App initials
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${color}" rx="${size * 0.2}"/>
    <text x="${size/2}" y="${size/2 + size*0.1}" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" fill="white">${text}</text>
  </svg>`;
};

// Icon sizes we need
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Creating PWA icons...');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate SVG files for each size
iconSizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const svgPath = path.join(publicDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created icon-${size}x${size}.svg`);
});

console.log('PWA icons created successfully!');
console.log('Note: You may want to convert these SVG files to PNG using an image editor or online tool for better browser compatibility.'); 