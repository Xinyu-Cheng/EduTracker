const mongoose = require('mongoose');

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Create the Student Model
const Student = mongoose.model('Student', studentSchema);

// Export the Model
module.exports = Student;
