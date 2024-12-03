import { v4 as uuidv4 } from "uuid";

export const generateSessionId = () => {
  const uuid = uuidv4();
  const sessionId = uuid.replace(/-/g, ""); // Remove all '-' characters
  return sessionId;
};
