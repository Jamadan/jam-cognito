const fs = require('fs');
const path = require('path');

const directories = [
  'dist',
  'images',
  'src',
  'src/popup',
  'src/types'
];

// Create directories if they don't exist
directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

console.log('Setup complete! Directories created successfully.'); 