const express = require('express');
const routes = require('./routes');
const db = require('./database/index');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(routes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.'});
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
