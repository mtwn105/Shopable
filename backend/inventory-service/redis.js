const { createClient } = require("redis");
const { Client } = require("redis-om");
const { productSchema } = require("./schemas");

require("dotenv").config();

let client = null;
let connection = null;
let productRepository = null;

(async () => {
  connection = createClient({
    url: process.env.REDIS_URL,
  });

  connection.on("error", (err) => console.log("Redis Client Error", err));

  await connection.connect();

  client = await new Client().use(connection);

  productRepository = client.fetchRepository(productSchema);

  await productRepository.dropIndex();
  await productRepository.createIndex();
})();

module.exports = {
  getClient: () => client,
  getConnection: () => connection,
  getProductRepository: () => productRepository,
};
