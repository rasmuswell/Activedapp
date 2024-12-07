import { blockchainAdress, blockchainAmount } from "../utils/config";

const MDS = (window as any).MDS;

export const checkmode = () => {
  console.log("abc");
  return new Promise((resolve, reject) => {
    MDS.cmd("checkmode", function (res) {
      console.log(res);

      if (res.status) {
        console.log("MiniDapp mode:", res.response.mode);
        console.log("Write mode:", res.response.writemode);
        resolve(res);
      }
    });
  });
};

export const saveToMDSFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    MDS.file.save(filename, data, function (response) {
      if (response.status) {
        console.log("File saved successfully!");
        console.log("Saved to:", response.response.file);
      } else {
        console.error("Error saving file:", response.error);
      }
    });
  });
};

export const readFile = (filename) => {
  const fileName = filename + ".md";
  return new Promise((resolve, reject) => {
    MDS.file.load(fileName, function (res) {
      console.log(res);

      if (res.status) {
        resolve(res.response.load.data);
      } else {
        console.log(res.error);
      }
    });
  });
};

export const sendData = (hash) => {
  const state = {
    33: hash,
  };
  return new Promise((resolve, reject) => {
    MDS.cmd(
      `send address:${blockchainAdress} amount:${blockchainAmount} state:${JSON.stringify(
        state
      )}`,
      (res) => {
        if (res.error) {
          console.log(res.error);
        }
        resolve(res);
      }
    );
  });
};

/**
 * Hash a given data (string) and return the hash.
 * @param {string} data The file data to be hashed.
 * @returns {Promise<IDataHash>} A promise that resolves with the file hash.
 */
export const hashData = (data): Promise<IDataHash> => {
  return new Promise((resolve, reject) => {
    // Convert Uint8Array to hex string without 0x prefix

    MDS.cmd(`hash data:${data}`, (res) => {
      if (res) {
        console.log(res);

        resolve(res.response.hash);
      } else {
        reject("Failed to get hash file");
      }
    });
  });
};

// /**
//  * Hash a given file data (Uint8Array) and return the hash.
//  * @param {Uint8Array} fileData The file data to be hashed.
//  * @returns {Promise<IDataHash>} A promise that resolves with the file hash.
//  */
// export const hashData = (fileData: Uint8Array): Promise<IDataHash> => {
//   return new Promise((resolve, reject) => {
//     // Convert Uint8Array to hex string without 0x prefix
//     const hexString = Array.from(fileData)
//       .map((b) => b.toString(16).padStart(2, "0"))
//       .join("");

//     MDS.cmd(`hash data:0x${hexString}`, (res) => {
//       if (res) {
//         resolve(res);
//       } else {
//         reject("Failed to get hash file");
//       }
//     });
//   });
// };
