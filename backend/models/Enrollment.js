const mongoose = require('mongoose');

// Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  });

// Create the Schedule Model
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// Export the Model
module.exports = Enrollment;
