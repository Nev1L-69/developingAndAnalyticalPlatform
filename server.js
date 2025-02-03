// server/index.js (Backend - Node.js/Express)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Measurement = require("./models/Measurement");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/analytics", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Fetch time-series data
app.get("/api/measurements", async (req, res) => {
    const { field, start_date, end_date } = req.query;
    if (!field || !start_date || !end_date) return res.status(400).json({ error: "Missing parameters" });
    try {
        const data = await Measurement.find({
            timestamp: { $gte: new Date(start_date), $lte: new Date(end_date) },
        }).select("timestamp " + field);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch statistics
app.get("/api/measurements/metrics", async (req, res) => {
    const { field } = req.query;
    if (!field) return res.status(400).json({ error: "Field parameter is required" });
    try {
        const data = await Measurement.find().select(field);
        const values = data.map((d) => d[field]);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const stdDev = Math.sqrt(values.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / values.length);
        res.json({ avg, min, max, stdDev });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));

// server/models/Measurement.js

// client/index.html (Frontend)

