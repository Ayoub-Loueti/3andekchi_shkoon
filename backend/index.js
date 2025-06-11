require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoute'); // Import user routes

connectDB();
const app = express();
app.use(express.json()); 

app.use(cors());
// app.use(cors({ origin: 'http://localhost:8081' }));

app.use('/users', userRoutes);

const PORT = process.env.PORT ; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
