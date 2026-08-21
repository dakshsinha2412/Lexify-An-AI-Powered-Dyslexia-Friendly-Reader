const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../chrome-extension');
const destDir = "c:\\Users\\User\\Downloads\\Lexify Project\\lexify-extension-unpacked";

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
files.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.lstatSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
    }
});

console.log("Successfully created unpacked extension directory at:", destDir);
