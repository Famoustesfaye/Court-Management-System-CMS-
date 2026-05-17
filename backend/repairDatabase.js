import mysql from "mysql2/promise";
import bluebird from "bluebird";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Empty password for XAMPP
  database: "court",
  Promise: bluebird,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function repairDatabase() {
  try {
    const connection = await db.getConnection();
    console.log("✓ Connected to database");

    console.log("🔧 Repairing clientreferences table...");
    await connection.query("REPAIR TABLE clientreferences");
    console.log("✓ clientreferences table repaired");

    console.log("🔧 Optimizing clientreferences table...");
    await connection.query("OPTIMIZE TABLE clientreferences");
    console.log("✓ clientreferences table optimized");

    console.log("✓ Checking table integrity...");
    const [checkResult] = await connection.query("CHECK TABLE clientreferences");
    console.log("Check result:", checkResult);

    connection.release();
    console.log("\n✓ Database repair completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error during repair:", error);
    process.exit(1);
  }
}

repairDatabase();
