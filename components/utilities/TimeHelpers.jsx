export function formatUTC(timestamp) {
  const date = new Date(timestamp);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedTimestamp = `${date.getUTCDate()} ${
    months[date.getUTCMonth()]
  } ${date.getUTCHours() % 12 || 12} ${date.getUTCHours() >= 12 ? "PM" : "AM"}`;

  return formattedTimestamp;
}

export function formatTimeDifference(startTime, endTime) {
  const timeDifference = endTime - startTime;
  const secondsPerDay = 24 * 60 * 60;
  const days = Math.floor(timeDifference / secondsPerDay);
  const hours = Math.floor((timeDifference % secondsPerDay) / (60 * 60));
  const minutes = Math.floor((timeDifference % (60 * 60)) / 60);
  const seconds = Math.floor(timeDifference % 60);

  let formattedTime = "";

  if (days > 0) {
    formattedTime += `${days}d `;
  }
  if (hours > 0) {
    formattedTime += `${hours}h `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes}min `;
  }
  if (seconds > 0) {
    formattedTime += `${seconds}s `;
  }

  return formattedTime.trim();
}
