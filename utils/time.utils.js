export const getISTTime = () => {
  return new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
};

export const getNextAvailability = (availability, currentIST) => {
  const now = new Date(currentIST);
  const [startHours, startMinutes] = availability.start.split(':').map(Number);
  // const [endHours, endMinutes] = availability.end.split(':').map(Number);

  let nextDate = new Date(now);
  nextDate.setHours(startHours, startMinutes, 0, 0);

  if (now > nextDate) {
    nextDate.setDate(nextDate.getDate() + 1);
  }

  const delay = nextDate - now;

  return {
    time: nextDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    delay,
  };
};

// Check if current time falls within recipient's availability window
export const isAvailableNow = (availability, currentIST) => {
  if (!availability) return false;
  const now = new Date(currentIST);

  // Parse availability hours from HH:MM format
  const [startHours, startMinutes] = availability.start.split(':').map(Number);
  const [endHours, endMinutes] = availability.end.split(':').map(Number);

  // Create Date objects for comparison
  const start = new Date(now).setHours(startHours, startMinutes, 0, 0);
  const end = new Date(now).setHours(endHours, endMinutes, 0, 0);

  return now >= start && now <= end;
};
