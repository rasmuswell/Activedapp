export const messageAPM = (data) => {
  if (data) {
    const match = data.match(/Actions: (\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
};

export const messageCPU = (data) => {
  if (data) {
    const match = data.match(/CPU Usage: (\d+(\.\d+)?)%/);
    return match ? match[0].split(": ")[1] : null;
  }
};
