const formatAustralianDate = (dateString) => {
  const dateObj = new Date(dateString);

  if (
    dateString === "" ||
    isNaN(dateObj.getTime()) ||
    dateString === null ||
    dateString === undefined
  ) {
    return "";
  }
  // Time in 12-hour format, e.g., "10:05 am"
  const time = dateObj.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Date in "9 June 2025" format
  const date = dateObj.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Combine into "10:05 am, 9 June 2025"
  return `${time}, ${date}`;
};
export default formatAustralianDate;
