const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  paid: { type: Boolean, default: false },
  attendance: { type: Boolean, default: false },
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
