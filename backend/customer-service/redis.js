const { createClient } = require("redis");
const { Client } = require("redis-om");
const { customerSchema } = require("./schemas");

require("dotenv").config();

let client = null;
let connection = null;
let customerRepository = null;

(async () => {
  connection = createClient({
    url: process.env.REDIS_URL,
  });

  connection.on("error", (err) => console.log("Redis Client Error", err));

  await connection.connect();

  client = await new Client().use(connection);

  customerRepository = client.fetchRepository(customerSchema);

  await customerRepository.dropIndex();
  await customerRepository.createIndex();
})();

module.exports = {
  getClient: () => client,
  getConnection: () => connection,
  getCustomerRepository: () => customerRepository,
};
