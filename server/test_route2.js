const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.get(/.*/, (req, res) => res.send('catchall 4 matched!'));

app.listen(5001, async () => {
    console.log('Server started');
    const res = await fetch('http://localhost:5001/');
    const text = await res.text();
    console.log('Response for /:', text);
    process.exit(0);
});
