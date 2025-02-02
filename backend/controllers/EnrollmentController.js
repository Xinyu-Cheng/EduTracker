const Enrollment = require('../models/Enrollment');

// Create a new enrollment
const createEnrollment = async (req, res) => {
    try {
        const { studentId, scheduleId } = req.body;
        if (!studentId) {
            return res.status(400).json({ error: 'studentId is required' });
        }
        if (!scheduleId) {
            return res.status(400).json({ error: 'scheduleId is required' });
        }
        const enrollment = new Enrollment({ student: studentId, schedule: scheduleId });
        await enrollment.save();
        res.status(201).json(enrollment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};