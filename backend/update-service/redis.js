const { createClient } = require("redis");
const { Client } = require("redis-om");

require("dotenv").config();

let client = null;
let connection = null;

(async () => {
  connection = createClient({
    url: process.env.REDIS_URL,
  });

  connection.on("error", (err) => console.log("Redis Client Error", err));

  await connection.connect();

  client = await new Client().use(connection);
})();

module.exports = {
  getClient: () => client,
  getConnection: () => connection,
};
