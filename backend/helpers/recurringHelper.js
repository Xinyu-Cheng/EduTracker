const moment = require('moment');

// Days of the week mapping to moment.js weekdays
const daysOfWeek = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/**
 * Generate recurring classes for multiple days of the week.
 * @param {Array} recurrence - Array of { day: String, time: String } objects. { day: "Monday", time: "20:00" }
 * @param {String} startDate - Start date in 'YYYY-MM-DD' format.
 * @param {String} scheduleId - ID of the schedule.
 * @returns {Array} - List of class objects to be inserted.
 */
const generateRecurringClasses = (recurrence, startDate, scheduleId) => {
  const classes = [];
  const startMoment = moment(startDate);

  // Validate recurrence
  recurrence.forEach(({ day, time }) => {
    if (!daysOfWeek.hasOwnProperty(day)) {
      throw new Error(`Invalid day: ${day}`);
    }

    const [hour, minute] = time.split(':').map(Number);
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error(`Invalid time format: ${time}`);
    }

    // Start generating classes from the first occurrence of the specified day
    let currentDate = startMoment.clone().day(daysOfWeek[day]);
    if (currentDate.isBefore(startMoment)) {
      currentDate.add(1, 'week'); // Move to the next week if the day has already passed
    }

    // Generate weekly classes for one year
    while (currentDate.isBefore(moment().add(1, 'year'))) {
      classes.push({
        time: currentDate.set({ hour, minute }).toDate(),
        schedule: scheduleId,
        price: 0, // Default price, can be set dynamically
        paid: false,
        attendance: false,
      });

      currentDate.add(1, 'week'); // Move to the next week's occurrence
    }
  });

  return classes;
};

module.exports = { generateRecurringClasses };
