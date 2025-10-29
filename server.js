const express = require('express');
const path = require('path');

require('dotenv').config({ path: './config/config.env' });
const hostname = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;

const logger = require('./middleware/logger');
const characterRoutes = require('./routes/characterRoutes');


const app = express();
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});



// middleware
app.use(logger); // brug logger middleware
app.use(express.json());// parse JSON body
app.use(express.static(path.join(__dirname, 'public'))); // statiske filer


// routes
app.use('/api/characters', characterRoutes);


// server
app.listen(PORT, hostname, () => {
    console.log(`Server kører på ${hostname}:${PORT}/`);
}).on('error', (err) => {
    console.error('Server error:', err);
});