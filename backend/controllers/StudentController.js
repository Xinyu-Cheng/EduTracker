const Student = require('../models/Student');

// Create a new student
const createStudent = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Please fill in student\'s name' });
        }
        const student = new Student({ name });
        await student.save();
        res.status(201).json(student);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};