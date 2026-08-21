const fs = require('fs');
const path = require('path');

const srcPath = "C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\e85dccad-9a83-4e55-af55-d21c009053db\\media__1787321034591.jpg";
const destExtension = path.resolve(__dirname, '../chrome-extension/icon.png');

fs.copyFileSync(srcPath, destExtension);
console.log("Successfully updated icon.png in chrome-extension!");
