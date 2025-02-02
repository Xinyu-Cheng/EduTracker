const Schedule = require('../models/Schedule');
const Instructor = require('../models/Instructor');
const Class = require('../models/Class');
const { generateRecurringClasses } = require('../helpers/recurringHelper');
const { createManyClass, createClass } = require('./ClassController');
const moment = require('moment');

// Create a new schedule
const createSchedule = async (req, res) => {
  const { courseName, instructorId, status = 'active', price = 0} = req.body;
  try {
    if (!courseName) {
      return res.status(400).json({ error: 'Please fill in courseName' });
    }
    if (!instructorId) {
      return res.status(400).json({ error: 'Please fill in instructorId' });
    }
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    const schedule = new Schedule({ courseName, instructor: instructor._id, status, price });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create a new schedule with recurring classes
const createScheduleWithClass = async (req, res) => {
  try {
    const { courseName, instructorId, recurrence = false, startDate, price = 0 } = req.body;

    // Validate required fields
    let emptyFields = [];
    if (!courseName) emptyFields.push('courseName');
    if (!instructorId) emptyFields.push('instructorId');
    if (!price) emptyFields.push('price');
    if (recurrence && (!startDate || !recurrence.length)) {
      emptyFields.push('startDate');
      emptyFields.push('recurrence');
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill in all required fields', emptyFields });
    }

    // Check if the instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Create the schedule
    const schedule = new Schedule({ courseName, instructor: instructor._id, price });
    await schedule.save();

    // Generate recurring classes if recurrence is provided
    if (recurrence) {
      const recurringClasses = generateRecurringClasses(recurrence, startDate, schedule._id);
      await createManyClass(recurringClasses);
    }

    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Set the status of a schedule to 'completed'
const setScheduleCompleted = async (req, res) => {
  try {
    const { scheduleId } = req.body;

    if (!scheduleId) {
      return res.status(400).json({ success: false, error: 'scheduleId is required' });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    schedule.status = 'completed';
    await schedule.save();

    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Set the status of a schedule to 'active'
const setScheduleActive = async (req, res) => {
  try {
    const { scheduleId } = req.body;

    if (!scheduleId) {
      return res.status(400).json({ success: false, error: 'scheduleId is required' });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    schedule.status = 'active';
    await schedule.save();

    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.body;

    if (!scheduleId) {
      return res.status(400).json({ success: false, error: 'scheduleId is required' });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    const classDeletionResult = await ClassController.deleteAllClassesSchedule({ schedule: scheduleId });
    await schedule.deleteOne();
    res.status(200).json({
      success: true,
      message: "Schedule and its related classes have been deleted",
      deletedClasses: classDeletionResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const addClassToSchedule = async (req, res) => {
  try {
    const { scheduleId, time, paid = false, attendance = false } = req.body;
    if (!scheduleId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: scheduleId" });
    } else if (!time) {
      return res.status(400).json({ error: "Missing required fields: time" });
    }
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    const newClass = await createClass({ time, schedule: scheduleId, paid, attendance });
    res.status(201).json({ success: true, data: newClass });
    return newClass;
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  createSchedule, 
  createScheduleWithClass,
  setScheduleCompleted, 
  setScheduleActive, 
  deleteSchedule,
  addClassToSchedule 
};
