/**
 * Formats a date string or object into 'DD/MM/YYYY'.
 * @param {string | Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDateVN = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Checks if a date is today.
 * @param {string | Date} date - The date to check.
 * @returns {boolean} True if today.
 */
export const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};
