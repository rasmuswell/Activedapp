import { hashData, readFile, sendData } from "./minima";
import { sendToTimeStamp } from "./timestamp";

//Veritas app have to be able to handle offset and packet size of this partial data to be able to verify the hash.
export const sendPartialToBlockchain = async (data) => {
  //Hash data
  const hashedData = await hashData(data);
  // console.log(hashedData);

  //Send transaction with hashed data
  sendToTimeStamp(hashedData);
};

export const sendFullToBlockchain = async (sessionId, setPendingUid) => {
  //Find file in MDS by sessionId
  const fileData = await readFile(sessionId);

  //Hash data
  const hashedData = await hashData(fileData);

  //Send transaction with hashed data
  const response = await sendData(hashedData);

  setPendingUid(response.pendinguid);
  // console.log(response.pendinguid);
};
