const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  price: { type: Number, required: true }, // Price per class
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
