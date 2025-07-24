// server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load .env variables
dotenv.config();
console.log('MongoDB URI:', process.env.MONGO_URI ? '✅ Found' : '❌ Not found');

const app = express();

// ✅ Middleware (order matters!)
app.use(cors({
  origin: ["project-test-iare.vercel.app"],
  methods: ['POST', 'GET'],
  credentials: true
}));
// ✅ JSON middleware before routes

// ✅ Routes
const userRoutes = require("./routes/userRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");


app.use(express.json()); 
app.use("/api/users", userRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/assignments", assignmentRoutes);


// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🎉 CONTEXTY Backend is Running!");
});

mongoose.connect('https://cloud.mongodb.com/v2/6869051c8085b878133af474#/metrics/replicaSet/68690822f20e6228f86d746a/explorer/test/users/find ');
// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas (contexty DB)"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


