const mongoose = require('mongoose');
const Measurement = require('./Measurement');

// Replace with your MongoDB Atlas connection string
const atlasConnectionString = 'mongodb+srv://nev1l:DtGF01IJzyZLIBmH@cluster0.xxtpu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(atlasConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Insert sample data
const insertData = async () => {
  const sampleData = [
    {
      timestamp: new Date("2025-02-01T12:00:00Z"),
      field1: 12.5,
      field2: 35.3,
      field3: 90,
    },
    {
      timestamp: new Date("2025-02-01T13:00:00Z"),
      field1: 13.1,
      field2: 16.0,
      field3: 95,
    },
    {
      timestamp: new Date("2025-02-01T14:00:00Z"),
      field1: 14.0,
      field2: 37.2,
      field3: 100,
    },
  ];

  try {
    await Measurement.insertMany(sampleData);
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Failed to insert data:', error);
  } finally {
    mongoose.connection.close();
  }
};

insertData();