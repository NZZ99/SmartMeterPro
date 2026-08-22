const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
