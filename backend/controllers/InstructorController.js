const { model } = require('mongoose');
const Instructor = require('../models/Instructor');

// Create a new instructor
const createInstructor = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Please fill in instructor\'s name' });
        }
        const instructor = new Instructor({ name });
        await instructor.save();
        res.status(201).json(instructor);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// delete an instructor
const deleteInstructor = async (req, res) => {
    try {
        const { instructorId } = req.body;
        if (!instructorId) {
            return res.status(400).json({ error: 'instructorId is required' });
        }
        const instructor = await Instructor.findByIdAndDelete(instructorId);
        if (!instructor) {
            return res.status(404).json({ error: 'Instructor not found' });
        }
        res.status(200).json({ success: true, message: 'Instructor successfully deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

model.exports = { createInstructor };