import { sendPartialToBlockchain } from "../services/blockchain";
import { saveToMDSFile } from "../services/minima";
import { TARGET_BYTE_SIZE } from "./config";

const dataArray: string[] = [];

export const saveDataToFile = async (sessionId, data) => {
  const filename = `${sessionId}.md`;
  //Create data with custom packet size
  const packetData = createPacketSizedData(data);
  dataArray.push(packetData);
  //   const dataToFile = JSON.stringify(dataArray);

  saveToMDSFile(filename, dataArray);
  //   if (dataArray.length % 10 === 0) {
  //     sendPartialToBlockchain(dataArray);
  //   }
};

const createPacketSizedData = (data) => {
  // Stringify the object
  let jsonString = JSON.stringify(data);

  // Calculate current byte size
  const currentSize = new TextEncoder().encode(jsonString).length;

  // Pad if necessary
  if (currentSize < TARGET_BYTE_SIZE) {
    const paddingSize = TARGET_BYTE_SIZE - currentSize - 3;
    const padding = "_".repeat(paddingSize); // Padding with spaces
    jsonString += padding;
  }

  // Add a delimiter
  const packet = jsonString + "$$$";

  // const packetSize = new TextEncoder().encode(packet).length;
  // console.log("Packet Data:", packetSize);
  return packet;
};
