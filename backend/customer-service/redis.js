const { createClient } = require("redis");
const { Client } = require("redis-om");
const { customerSchema, cartSchema, cartItemsSchema } = require("./schemas");

require("dotenv").config();

let client = null;
let connection = null;
let customerRepository = null;
let cartRepository = null;
let cartItemsRepository = null;

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

  cartRepository = client.fetchRepository(cartSchema);
  await cartRepository.dropIndex();
  await cartRepository.createIndex();

  cartItemsRepository = client.fetchRepository(cartItemsSchema);
  await cartItemsRepository.dropIndex();
  await cartItemsRepository.createIndex();
})();

module.exports = {
  getClient: () => client,
  getConnection: () => connection,
  getCustomerRepository: () => customerRepository,
  getCartRepository: () => cartRepository,
  getCartItemsRepository: () => cartItemsRepository,
};
