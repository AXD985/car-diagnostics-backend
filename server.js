// Version 2.0 - Final Fix
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let carData = { rpm: 0, speed: 0, temp: 0 }; 

app.get('/api/obd2', (req, res) => {
    res.json(carData);
});

app.post('/api/obd2', (req, res) => {
    carData = req.body;
    res.send("Data Received");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running`));