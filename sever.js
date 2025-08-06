const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Ping route to keep the bot awake
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
