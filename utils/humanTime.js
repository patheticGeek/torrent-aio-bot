function humanTime(ms) {
  let seconds = ms / 1000;
  let result = "";
  const days = Math.floor((seconds % 31536000) / 86400);
  if (days > 0) result += `${days}d `;
  const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  if (hours > 0) result += `${hours}h `;
  const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  if (minutes > 0) result += `${minutes}m `;
  seconds = ((((seconds % 31536000) % 86400) % 3600) % 60).toFixed(0);
  if (seconds > 0) result += `${seconds}s`;
  if (result === "") result += "0s";
  return result;
}

module.exports = humanTime;
