const mongoose = require("mongoose");

module.exports = async (options = {}) => {
  try {
    const mongoURL = process.env.MONGO_URL;
    if (!mongoURL) throw new Error("MONGO_URL not found in environment");

    // Optional explicit database override.
    // Setting MONGO_DB_NAME (e.g. dummy_db) overrides the database name.
    const explicitDbName = (process.env.MONGO_DB_NAME || "").trim();
    const port = (process.env.PORT || "5000").toString();

    // When running the dummy testing instance (PORT 5001 or explicit MONGO_DB_NAME=dummy_db or requireDummyDb),
    // always connect with dbName: "dummy_db".
    const isDummyInstance = port === "5001" || explicitDbName === "dummy_db" || options.requireDummyDb;
    const dbName = isDummyInstance ? "dummy_db" : (explicitDbName || undefined);

    if (dbName) {
      await mongoose.connect(mongoURL, { dbName });
    } else {
      await mongoose.connect(mongoURL);
    }

    const activeDb = mongoose.connection.name;

    // Log only the resolved database name and port — never the URI or credentials.
    console.log(`✅ Database connected successfully (database: ${activeDb}, port: ${port})`);

    // Safety guard: Any dummy testing instance MUST be connected to 'dummy_db'.
    // If it ever connected to any other database, immediately disconnect and abort.
    if (isDummyInstance && activeDb !== "dummy_db") {
      await mongoose.disconnect();
      throw new Error(`🛑 SAFETY ABORT: Testing instance on port ${port} is strictly restricted to 'dummy_db', but connected to '${activeDb}'. Halting immediately.`);
    }

    return mongoose.connection;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});
