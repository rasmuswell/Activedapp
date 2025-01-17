const mysql = require("mysql2/promise");
const crypto = require("crypto");

// Generate a random hash
function generateRandomHash(length = 20) {
  const characters = "0123456789ABCDEF";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    randomString += characters[randomIndex];
  }
  return "0x" + randomString;
}

const insertDataToDB = async (tsData) => {
  const uid = generateRandomHash();

  try {
    // Connect to the database
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "tutorial",
      password: "secret",
      database: "tutorial",
      port: 3308,
    });

    // SQL query to insert data
    const sql = "INSERT INTO timestampdata (uid, datahash) VALUES (?, ?)";
    await connection.execute(sql, [uid, tsData]);

    // console.log(`Data added to DB uid: ${uid}, data: ${tsData}`);

    // Close the connection
    await connection.end();
    return uid;
  } catch (err) {
    console.error("Database error:", err);
  }
};

// Function to fetch data by UID
const fetchDataByUid = async (uid) => {
  try {
    // Connect to the database
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "tutorial",
      password: "secret",
      database: "tutorial",
      port: 3308, // Adjust port if necessary
    });

    // SQL query to select data
    const sql = "SELECT * FROM timestampdata WHERE uid = ?";
    const [rows] = await connection.execute(sql, [uid]);

    if (rows.length === 0) {
      // UID not found
      return {
        status: false,
        uid: uid,
        error: "UID not found",
      };
    } else {
      const row = rows[0];
      const response = {
        status: true,
        uid: uid,
        data: row.datahash,
        number: row.idtimestampdata,
        datecreated: row.datecreated,
      };

      if (row.hasbeenadded === 0) {
        // Not added to chain yet
        response.onchain = false;
      } else {
        // Added on chain
        response.onchain = true;
        response.datestamped = row.datestamped;
        response.root = row.roottreehash;
        response.proof = row.proof;
        response.address = "0xFFEEDD";
      }

      return response;
    }
  } catch (err) {
    console.error("Database error:", err);
    return { status: false, error: "Internal server error" };
  }
};

module.exports = { fetchDataByUid, insertDataToDB };
