const mongoose = require('mongoose');

// Schedule Schema
const scheduleSchema = new mongoose.Schema({
    course_name: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
  });

// Create the Schedule Model
const Schedule = mongoose.model('Schedule', scheduleSchema);

// Export the Model
module.exports = Schedule;
