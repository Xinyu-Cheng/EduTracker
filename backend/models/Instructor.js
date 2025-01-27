const mongoose = require('mongoose');

// Instructor Schema
const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Create the Instructor Model
const Instructor = mongoose.model('Instructor', instructorSchema);

// Export the Model
module.exports = Instructor;
