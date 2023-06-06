export const getTimeString = (date) => {
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
};
export const getDateString = (date) => {
  // Get year, month, and day part from the date
  let year = date.toLocaleString("default", { year: "numeric" });
  let month = date.toLocaleString("default", { month: "2-digit" });
  let day = date.toLocaleString("default", { day: "2-digit" });

  // Generate yyyy-mm-dd date string
  return year + "-" + month + "-" + day;
};
export const getDiffString = (diffMs) => {
  var diffDays = Math.floor(diffMs / 86400000); // days
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  return diffHrs + ":" + diffMins
}