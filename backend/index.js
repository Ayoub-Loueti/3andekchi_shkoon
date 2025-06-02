const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoute'); 

require('dotenv').config();

connectDB();
const app = express();
app.use(express.json()); 

app.use('/users', userRoutes);

const PORT = process.env.PORT ; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
