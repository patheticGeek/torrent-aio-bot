function humanTime(ms) {
  let seconds = ms / 1000;
  let result = "";
  const days = Math.floor((seconds % 31536000) / 86400);
  if (days > 0) result += `${days} days `;
  const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  if (hours > 0) result += `${hours} hours `;
  const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  if (minutes > 0) result += `${minutes} minutes `;
  seconds = ((((seconds % 31536000) % 86400) % 3600) % 60).toFixed(0);
  if (seconds > 0) result += `${seconds} seconds`;
  if (result === "") result += "finished";
  return result;
}

module.exports = humanTime;
