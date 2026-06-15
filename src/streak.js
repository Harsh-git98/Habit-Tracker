function toUtcDateString(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getWeekStart(dateString) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  const weekday = date.getUTCDay();
  const daysFromMonday = (weekday + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysFromMonday);
  return date.toISOString().slice(0, 10);
}

function addWeeks(dateString, weeks) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + (weeks * 7));
  return date.toISOString().slice(0, 10);
}

function calculateDailyStreak(completedDateSet, anchorDate) {
  let streak = 0;
  let cursor = anchorDate;

  while (completedDateSet.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function calculateWeeklyStreak(completedDateSet, anchorDate) {
  let streak = 0;
  let cursorWeekStart = getWeekStart(anchorDate);

  while (true) {
    const hasCompletionInWeek = Array.from(completedDateSet).some((date) => {
      const weekStart = getWeekStart(date);
      return weekStart === cursorWeekStart;
    });

    if (!hasCompletionInWeek) {
      break;
    }

    streak += 1;
    cursorWeekStart = addWeeks(cursorWeekStart, -1);
  }

  return streak;
}

function calculateCurrentStreak({ completedDates = [], frequency = 'daily', anchorDate = new Date() }) {
  const anchorDateString = toUtcDateString(anchorDate);
  if (!anchorDateString) {
    return 0;
  }

  const completedDateSet = new Set(
    completedDates
      .map((dateValue) => toUtcDateString(dateValue))
      .filter(Boolean)
      .filter((dateValue) => dateValue <= anchorDateString)
  );

  if (frequency === 'weekly') {
    return calculateWeeklyStreak(completedDateSet, anchorDateString);
  }

  return calculateDailyStreak(completedDateSet, anchorDateString);
}

module.exports = {
  calculateCurrentStreak,
};
