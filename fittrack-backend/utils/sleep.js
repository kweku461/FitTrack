const MAX_SLEEP_HOURS = 24;

// Returns { hours } on success or { error } on bad input.
function parseSleep(bedtime, wakeTime) {
  if (typeof bedtime !== 'string' || typeof wakeTime !== 'string') {
    return { error: 'bedtime and wake_time must be date-time strings' };
  }

  const bed = new Date(bedtime);
  const wake = new Date(wakeTime);

  if (Number.isNaN(bed.getTime()) || Number.isNaN(wake.getTime())) {
    return { error: 'bedtime and wake_time must be valid date-times' };
  }

  if (wake <= bed) {
    return {
      error: 'wake_time must be after bedtime. For overnight sleep, pick the next day as the wake date.',
    };
  }

  const hours = (wake - bed) / (1000 * 60 * 60);

  if (hours > MAX_SLEEP_HOURS) {
    return { error: `Sleep duration can't exceed ${MAX_SLEEP_HOURS} hours` };
  }

  return { hours: Math.round(hours * 100) / 100 };
}

module.exports = { parseSleep, MAX_SLEEP_HOURS };