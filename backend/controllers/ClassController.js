const Class = require("../models/Class");
const Schedule = require("../models/Schedule");
/**
 * Inserts multiple class documents into the database
 * @param {Array} classes - Array of class objects to insert
 * @returns {Promise<Array>} - Returns the inserted class objects
 */
const createManyClass = async (classes) => {
  try {
    const insertedClasses = await Class.insertMany(classes);
    return insertedClasses;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createClass = async (scheduleId, time, paid = false, attendance = false) => {
  try {
    // Validate required fields
    if (!scheduleId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: scheduleId" });
    } else if (!time) {
      return res.status(400).json({ error: "Missing required fields: time" });
    }
    // Check if schedule exists
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    const timeObject = new Date(time);
    if (isNaN(timeObject.getTime())) {
      return res.status(400).json({ error: "Invalid time format" });
    }

    // Create class document
    const newClass = new Class({
      timeObject,
      schedule: scheduleId,
      paid,
      attendance,
    });
    // Save to database
    await newClass.save();

    res.status(201).json({ success: true, data: newClass });
    return newClass;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClassById = async (req, res) => {
    try {
      const { classId } = req.params;
      if (!classId) {
        return res.status(400).json({ error: 'classId is required' });
      }
      const classObj = await Class.findById(classId).populate('schedule', 'courseName price');
      if (!classObj) {
        return res.status(404).json({ error: 'Class not found' });
      }
      res.status(200).json({ success: true, data: classObj });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const getClassesBySchedule = async (req, res) => {
    try {
      const { scheduleId } = req.params;
      if (!scheduleId) {
        return res.status(400).json({ error: 'scheduleId is required' });
      }
      const classes = await Class.find({ schedule: scheduleId }).sort({ time: 1 });
      res.status(200).json({ success: true, data: classes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const getUpcomingClasses = async (req, res) => {
    try {
      const classes = await Class.find({ time: { $gte: new Date() } })
        .populate('schedule', 'courseName')
        .sort({ time: 1 });
      res.status(200).json({ success: true, data: classes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  

const changeSchedule = async (req, res) => {
  try {
    const { classId, scheduleId } = req.body;
    if (!scheduleId) {
      return res.status(400).json({ error: "scheduleId is required" });
    } else if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }
    classObj.schedule = scheduleId;
    await classObj.save();
    res.status(200).json({ success: true, data: classObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changeTime = async (req, res) => {
  try {
    const { classId, time } = req.body;
    if (!time) {
      return res.status(400).json({ error: "time is required" });
    } else if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }
    const timeObject = new Date(time);
    if (isNaN(timeObject.getTime())) {
        return res.status(400).json({ error: 'Invalid time format' });
    }

    classObj.time = timeObject;
    await classObj.save();
    res.status(200).json({ success: true, data: classObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAttendance = async (req, res) => {
    try {
      const { classId } = req.body;
      if (!classId) return res.status(400).json({ error: "classId is required" });
  
      const classObj = await Class.findByIdAndUpdate(
        classId,
        { $bit: { attendance: { xor: 1 } } }, // Toggle attendance
        { new: true }
      );
  
      if (!classObj) return res.status(404).json({ error: "Class not found" });
  
      res.status(200).json({ success: true, data: classObj });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  

const markPaid = async (req, res) => {
    try {
        const { classId } = req.body;
        if (!classId) return res.status(400).json({ error: "classId is required" });
    
        const classObj = await Class.findByIdAndUpdate(
          classId,
          { $bit: { paid: { xor: 1 } } }, // Toggle paid
          { new: true }
        );
    
        if (!classObj) return res.status(404).json({ error: "Class not found" });
    
        res.status(200).json({ success: true, data: classObj });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteClass = async (req, res) => {
  try {
    const { classId } = req.body;
    if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }
    const classObj = await Class.findByIdAndDelete(classId);
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json({ success: true, message: "Class successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAllClassesSchedule = async (scheduleId) => {
  try {
    if (!scheduleId) {
      throw new Error("scheduleId is required");
    }
    schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    const result = await Class.deleteMany({ schedule: scheduleId });
    return { success: true, deletedCount: result.deletedCount };

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
    createManyClass,
    createClass,
    changeSchedule,
    changeTime,
    markAttendance,
    markPaid,
    deleteClass,
    deleteAllClassesSchedule,
    getClassById,
    getClassesBySchedule,
    getUpcomingClasses
};
