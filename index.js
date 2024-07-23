const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the same directory as index.js
app.use(express.static(__dirname));

// MongoDB connection
let mongoURI = '';

// Serve the form HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Handle MongoDB URI submission from form
app.post('/', (req, res) => {
  mongoURI = req.body.myuri;

  // Check if the URI starts with 'mongodb://' or 'mongodb+srv://'
  if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
    return res.status(400).send('Invalid MongoDB URI. URI must start with "mongodb://" or "mongodb+srv://".');
  }

  // Connect to MongoDB using the provided URI
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Summer24'
  })
  .then(() => {
    console.log('Connected to MongoDB');

    // Define schema and model for MongoDB document
    const studentSchema = new mongoose.Schema({
      myName: { type: String, required: true },
      mySID: { type: String, required: true },
    });

    const Student = mongoose.model('s24students', studentSchema);

    // Hard-coded values for demonstration (replace with your real name and SID)
    const myName = 'Jackie Kim';
    const mySID = '300376300';

    // Create a new document and save it to MongoDB
    const newStudent = new Student({ myName, mySID });
    return newStudent.save();
  })
  .then(() => {
    console.log('Document added successfully');
    res.send('<h1>Document Added</h1>');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    res.status(500).send('Error connecting to MongoDB');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
