// creates an array of 7 days, each with 48 timeslots
// each timeslot has a moment object reflecting that time
export const getCalendarDays = (startDate) => {
  // start with 7 days
  const days = [...Array(7)].map((day) => {
    const timeslots = [];

    // each timeslot will have a moment object
    [...Array(48)].map(() => {
      timeslots.push({
        moment: startDate.clone(),
        selected: false
      });
      startDate.add(30, 'minutes');
    });

    return {
      startMoment: startDate.clone(),
      endMoment: startDate.clone().endOf('day'),
      timeslots
    };
  });

  return days;
};
