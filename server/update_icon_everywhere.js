const fs = require('fs');
const path = require('path');

const srcPath = "C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\e85dccad-9a83-4e55-af55-d21c009053db\\media__1787321235853.jpg";
const destPublicIcon = path.resolve(__dirname, '../client/public/logo-icon.png');
const destPublicLogo = path.resolve(__dirname, '../client/public/logo.png');
const destAssets = path.resolve(__dirname, '../client/src/assets/logo.png');
const destExtension = path.resolve(__dirname, '../chrome-extension/icon.png');

fs.copyFileSync(srcPath, destPublicIcon);
fs.copyFileSync(srcPath, destPublicLogo);
fs.copyFileSync(srcPath, destAssets);
fs.copyFileSync(srcPath, destExtension);

console.log("Successfully updated logo icons everywhere!");
