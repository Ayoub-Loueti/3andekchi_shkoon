const express = require('express');
const connectDB = require('./config/db');

require('dotenv').config();

connectDB();
const app = express();
app.use(express.json()); 

const PORT = process.env.PORT ; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
