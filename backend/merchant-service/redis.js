const { createClient } = require("redis");

require("dotenv").config();

module.exports = {
  connectToRedis: async () => {
    const client = createClient({
      url: process.env.REDIS_URL,
      // username: process.env.REDIS_USERNAME,
      // password: process.env.REDIS_PASSWORD,
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    return client;
  },
};
