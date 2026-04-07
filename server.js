const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// مخزن البيانات المؤقت (سيبقى هنا طالما السيرفر يعمل)
let carData = { 
    rpm: 0, speed: 0, temp: 0, voltage: 12.6, 
    load: 0, vin: "Searching...", dtc_code: null 
};

// 1. استقبال البيانات من ملف البايثون (bridge.py)
app.post('/update', (req, res) => {
    carData = { ...carData, ...req.body };
    console.log("تم استقبال بيانات جديدة:", carData);
    res.send({ status: "success" });
});

// 2. إرسال البيانات لواجهة الـ React (TITAN PRO MAX)
app.get('/api/obd2', (req, res) => {
    res.json(carData);
});

// 3. مسار للتأكد أن السيرفر شغال عند فتحه في المتصفح
app.get('/', (req, res) => {
    res.send("<h1>TITAN SERVER IS ACTIVE ✅</h1>");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});