const { createClient } = require("redis");
const { Client } = require("redis-om");
const { orderSchema, orderItemsSchema } = require("./schemas");

require("dotenv").config();

let client = null;
let connection = null;
let orderRepository = null;
let orderItemsRepository = null;

(async () => {
  connection = createClient({
    url: process.env.REDIS_URL,
  });

  connection.on("error", (err) => console.log("Redis Client Error", err));

  await connection.connect();

  client = await new Client().use(connection);

  orderRepository = client.fetchRepository(orderSchema);
  await orderRepository.dropIndex();
  await orderRepository.createIndex();

  orderItemsRepository = client.fetchRepository(orderItemsSchema);
  await orderItemsRepository.dropIndex();
  await orderItemsRepository.createIndex();
})();

module.exports = {
  getClient: () => client,
  getConnection: () => connection,
  getOrderRepository: () => orderRepository,
  getOrderItemsRepository: () => orderItemsRepository,
};
