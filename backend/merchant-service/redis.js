const { createClient } = require("redis");
const { Client } = require("redis-om");
const { merchantSchema } = require("./schemas");

require("dotenv").config();

let client = null;
let connection = null;
let merchantRepository = null;

(async () => {
  connection = createClient({
    url: process.env.REDIS_URL,
  });

  connection.on("error", (err) => console.error("Redis Client Error", err));
  connection.on("connect", function () {
    console.log("Redis connected");
  });

  await connection.connect();

  client = await new Client().use(connection);

  merchantRepository = client.fetchRepository(merchantSchema);

  await merchantRepository.dropIndex();
  await merchantRepository.createIndex();
})();

module.exports = {
  getClient: () => client,
  getConnection: () => connection,
  getMerchantRepository: () => merchantRepository,
};
