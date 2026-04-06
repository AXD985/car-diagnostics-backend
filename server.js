const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const server = http.createServer(app);

// تفعيل CORS للسماح للمتصفح بالاتصال (كما في صورتك)
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// إعداد ذكاء Gemini باستخدام مفتاحك (انسخ المفتاح من الصورة وضعه هنا)
const genAI = new GoogleGenerativeAI("ضغ_مفتاح_API_الخاص_بك_هنا");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. استقبال بيانات OBD2 من السيارة وبثها للعدادات
app.post('/api/obd2', (req, res) => {
  const data = req.body;
  console.log("بيانات حية من السيارة:", data);
  io.emit('car_data', data); // إرسال للـ Frontend فوراً
  res.json({ message: "تم الاستلام بنجاح" });
});

// 2. محرك التشخيص الذكي (ربط Gemini الحقيقي)
app.post('/ask', async (req, res) => {
  const { question } = req.body;
  try {
    const prompt = `أنت خبير ميكانيكا سيارات محترف. أجب باختصار واحترافية على هذا السؤال: ${question}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ answer: response.text() });
  } catch (error) {
    res.status(500).json({ answer: "عذراً أحمد، حدث خطأ في الاتصال بذكاء Gemini." });
  }
});

server.listen(5001, () => {
  console.log("🚀 تيتان برو يعمل الآن على: http://localhost:5001");
});