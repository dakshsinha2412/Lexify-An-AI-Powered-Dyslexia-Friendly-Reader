const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(5002, async () => {
  console.log('Test server started on 5002');
  try {
    const res = await fetch('http://localhost:5002/');
    const text = await res.text();
    console.log('Response for /:', text.substring(0, 50));
  } catch (e) {
    console.log('Fetch error:', e);
  }
  process.exit();
});
