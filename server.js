
// Replace with your Atlas connection string
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Add this line
const Measurement = require('./Measurement'); // Import the schema

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files (e.g., index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const atlasConnectionString = 'mongodb+srv://nev1l:DtGF01IJzyZLIBmH@cluster0.xxtpu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(atlasConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// API Endpoints
app.get('/api/measurements', async (req, res) => {
  const { fields, start_date, end_date } = req.query;
  const selectedFields = fields.split(',');

  try {
    const data = await Measurement.find({
      timestamp: { $gte: new Date(start_date), $lte: new Date(end_date) },
    }).select(`timestamp ${selectedFields.join(' ')}`);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/measurements/metrics', async (req, res) => {
  const { field, start_date, end_date } = req.query;

  try {
    const data = await Measurement.find({
      timestamp: { $gte: new Date(start_date), $lte: new Date(end_date) },
    }).select(field);

    const values = data.map((item) => item[field]);
    if (values.length === 0) {
      return res.json({ error: `No data found for ${field} in the specified date range` });
    }

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const stdDev = Math.sqrt(
      values.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / values.length,
    );

    res.json({ avg, min, max, stdDev });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate metrics' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});