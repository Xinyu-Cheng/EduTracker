const mongoose = require('mongoose');

// Class Schema
const classSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    attendance: { type: Boolean, default: false },
    price: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  });

// Create the Class Model
const Class = mongoose.model('Class', classSchema);

// Export the Model
module.exports = Class;
