const express = require('express');
const app = express();

app.get('/test', (req, res) => res.send('test OK'));

try {
  app.get('/{*}', (req, res) => res.send('catchall 1'));
  console.log('/{*} works');
} catch (e) {
  console.log('/{*} failed:', e.message);
}

try {
  app.get('/:path(.*)', (req, res) => res.send('catchall 2'));
  console.log('/:path(.*) works');
} catch (e) {
  console.log('/:path(.*) failed:', e.message);
}

try {
  app.get('/*', (req, res) => res.send('catchall 3'));
  console.log('/* works');
} catch (e) {
  console.log('/* failed:', e.message);
}

try {
    app.get(/.*/, (req, res) => res.send('catchall 4'));
    console.log('/.*/ works');
} catch (e) {
    console.log('/.*/ failed:', e.message);
}
