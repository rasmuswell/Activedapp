import { blockchainAdress, blockchainAmount } from "../utils/config";

const MDS = (window as any).MDS;

export const checkmode = () => {
  return new Promise((resolve) => {
    MDS.cmd("checkmode", function (res) {
      if (res.status) {
        // console.log("MiniDapp mode:", res.response.mode);
        // console.log("Write mode:", res.response.writemode);
        resolve(res);
      }
    });
  });
};

export const checkStatus = () => {
  return new Promise((resolve) => {
    MDS.cmd("status", function (res) {
      if (res.status) {
        // console.log("MiniDapp mode:", res.response.chain.time);
        resolve(res.response.chain.time);
      } else {
        console.log("Error");
      }
    });
  });
};

export const saveToMDSFile = (filename, data) => {
  return new Promise(() => {
    MDS.file.save(filename, data, function (response) {
      if (response.status) {
        // console.log("File saved successfully!");
        // console.log("Saved to:", response.response.file);
      } else {
        console.error("Error saving file:", response.error);
      }
    });
  });
};

export const readFile = (filename) => {
  const fileName = filename + ".md";
  return new Promise((resolve) => {
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

export const sendData = (hash): Promise<ITransactionResponse> => {
  console.log("HASH SENT:", hash);

  const state = {
    99: hash,
  };
  return new Promise((resolve) => {
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

export const listenPendingTxn = (setBlockChainStatus, pendingUid) => {
  return new Promise((resolve) => {
    MDS.init((msg) => {
      if (msg.event == "MDS_PENDING") {
        // Extract relevant information
        console.log(msg);

        // const pending = msg.data.result.pending;
        const pendinguid = msg.data.uid;

        if (pendinguid === pendingUid) {
          setBlockChainStatus(
            "Transaction has been sent. You can now exit the session."
          );
          resolve("confirmation");
        }
      }
    });
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
        // console.log(res);

        resolve(res.response.hash);
      } else {
        reject("Failed to get hash file");
      }
    });
  });
};
