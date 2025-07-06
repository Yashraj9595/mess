const fs = require('fs');
const path = require('path');

// Icon sizes that should exist
const requiredSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Check if icons exist and have correct sizes
function checkIcons() {
  const publicDir = path.join(__dirname, '../public');
  const manifestPath = path.join(publicDir, 'manifest.json');
  
  console.log('🔍 Checking PWA icons...\n');
  
  // Read manifest
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found!');
    return;
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const manifestIcons = manifest.icons || [];
  
  console.log('📋 Manifest icons:');
  manifestIcons.forEach(icon => {
    const iconPath = path.join(publicDir, icon.src.replace(/^\//, ''));
    const exists = fs.existsSync(iconPath);
    console.log(`  ${icon.src} (${icon.sizes}) - ${exists ? '✅' : '❌'} ${exists ? 'Found' : 'Missing'}`);
  });
  
  console.log('\n📁 Checking all icon files:');
  const files = fs.readdirSync(publicDir);
  const iconFiles = files.filter(file => file.startsWith('icon-') && file.endsWith('.png'));
  
  iconFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  ${file} - ${stats.size} bytes`);
  });
  
  console.log('\n💡 Recommendations:');
  console.log('1. Ensure all PNG icons exist and are the correct size');
  console.log('2. Icons should be square (e.g., 144x144 pixels)');
  console.log('3. Use PNG format for better compatibility');
  console.log('4. Consider using a tool like ImageMagick or online resizers to create proper sizes');
}

checkIcons(); 