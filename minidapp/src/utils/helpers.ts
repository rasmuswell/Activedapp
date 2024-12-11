export const splitDate = (type, datetime) => {
  if (type === "date") {
    const date = datetime.split("T")[0]; // Split by 'T' and take the first part
    return date;
  }
  if (type === "time") {
    const time = datetime.split("T")[1]; // Split by 'T' and take the first part
    const timeWithoutMs = time.split(".")[0]; // Split by '.' and take the first part
    return timeWithoutMs;
  }
};
