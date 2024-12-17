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

    console.log(`Data added to DB uid: ${uid}, data: ${tsData}`);
    // Close the connection
    await connection.end();
    return uid;
  } catch (err) {
    console.error("Database error:", err);
  }
};

module.exports = { insertDataToDB };
