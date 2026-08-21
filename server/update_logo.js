const fs = require('fs');
const path = require('path');

const srcPath = "C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\e85dccad-9a83-4e55-af55-d21c009053db\\media__1787321034591.jpg";
const destPublic = path.resolve(__dirname, '../client/public/logo.png');
const destAssets = path.resolve(__dirname, '../client/src/assets/logo.png');

fs.copyFileSync(srcPath, destPublic);
fs.copyFileSync(srcPath, destAssets);
console.log("Successfully updated logo.png in public and src/assets!");
