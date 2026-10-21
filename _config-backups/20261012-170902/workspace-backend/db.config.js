const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;
    if (!mongoURL) throw new Error("MONGO_URL not found in environment");

    // Optional explicit database override. When unset (the default), the
    // database is taken from the URI path exactly as before — so existing
    // deployments are unaffected. Setting MONGO_DB_NAME lets a second instance
    // of this SAME backend point at another database (e.g. `dummy_db`) while
    // sharing the cluster URI and credentials.
    const dbName = (process.env.MONGO_DB_NAME || "").trim() || undefined;

    if (dbName) {
      await mongoose.connect(mongoURL, { dbName });
    } else {
      await mongoose.connect(mongoURL);
    }

    // Log only the resolved database name — never the URI or credentials.
    console.log(`✅ Database connected successfully (database: ${mongoose.connection.name})`);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});
