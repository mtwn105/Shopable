# Shoppable - E-commerce for Everyone

A Platform to create an online store for your business. 
Powered by Redis Stack!

![image](https://user-images.githubusercontent.com/12975481/187288703-1ff8c94f-75d7-4547-b86d-f01959a9511f.png)

## Powered By

**Redis Stack** (RedisJSON, RedisSearch, Redis Streams)
**NodeJS**
**Angular**

## Demo Video
Checkout video [here](https://youtu.be/sxY6KHoRkn8)

## How it works

### Process flow

- Merchant can register on the platform and create a store
- He can add the items to inventory
- A customer can visit that merchant store
- Customer can purchase items listed by merchant
- Merchant will receive the order and will fulfill it
- Customer will receive notifications regarding the order

### Technical Overview

- There are 6 microservices (merchant, inventory, customer, order, update, file-upload)
- All servers are based on **NodeJS**
- The client is based on **Angular** and **Angular Material**
- An nginx is used to route request to various microservices as a reverse proxy
- Redis Stack is integrated with the help of **[Redis OM](https://github.com/redis/redis-om-node)** and **[Node Redis](https://github.com/redis/node-redis)** NodeJS libraries
- Redis Stack is hosted on Redis Cloud itself
- **RedisJSON**, **RedisSearch** and **Redis Streams** has been used
- **RedisJSON** is used to store JSON documents for various schema such as Merchant, Customer, Product, Order, etc.
- **RedisSearch** is used alongside RedisJSON to search through different repositories
- **Redis Streams** is used for publishing and listening to order updates and send email using **Mailjet** to the customer regarding the update
- Apart from this, **Google Cloud Storage** is also used to store images of the products uploaded by the merchant

### Architecture Diagram

![shoppable_architecture](https://user-images.githubusercontent.com/12975481/187291224-8f99a51d-ca8b-4f3c-b312-b051ebcf636c.png)

### How the data is stored:

There are many schemas involved in different microservices and each having their own fields

Here's an example of a **Order** schema:
```javascript
const orderSchema = new Schema(Order, {
  merchantId: { type: "string" },
  customerId: { type: "string" },
  status: { type: "string" },
  price: { type: "number" },
  name: { type: "string" },
  phoneNumber: { type: "number" },
  email: { type: "string" },
  address: { type: "string" },
  state: { type: "string" },
  country: { type: "string" },
  createdDate: { type: "date", sortable: true },
  modifiedDate: { type: "date" },
});
```

Here's the save command:

```javascript
// Create Order
let order = {
  merchantId,
  customerId,
  status: "PLACED",
  price: totalPrice,
  name,
  phoneNumber,
  email,
  address,
  state,
  country,
  createdDate: new Date(),
  modifiedDate: new Date(),
};

order = await orderRepository.createAndSave(order);
```

Here's a look at RedisInsight:

![image](https://user-images.githubusercontent.com/12975481/187294325-96845300-3795-4c1c-8368-d260adea74c2.png)

### How the data is accessed:

There are many different types of data access operations happened in the process flow.

Here's an example of fetching orders for a customer on a store:
```javascript
 const orders = await orderRepository
      .search()
      .where("customerId")
      .equals(customerId)
      .sortBy("createdDate", "DESC")
      .return.all();
```

For listening to Redis Stream this command is used:

```sh
XRANGE orders-update - +
```

## How to run it locally?

- Install dependencies in both `backend` and `client` using `npm install`
- Create `.env` file and fill necessary variable values
- Run all the microservices in `backend` folder by `npm run start`
- Run angular client in `client` folder by running `ng s`

### Prerequisites

- Node
- Redis Stack
- Google Cloud Storage
- Mailjet API

## Deployment

The project is deployed on **Northflank** - [Visit Here](https://shoppable.amitwani.dev)

![image](https://user-images.githubusercontent.com/12975481/187292974-b755f9da-2b9a-4212-a035-a90b55f218fa.png)

## More Information about Redis Stack

Here some resources to help you quickly get started using Redis Stack. If you still have questions, feel free to ask them in the [Redis Discord](https://discord.gg/redis) or on [Twitter](https://twitter.com/redisinc).

### Getting Started

1. Sign up for a [free Redis Cloud account using this link](https://redis.info/try-free-dev-to) and use the [Redis Stack database in the cloud](https://developer.redis.com/create/rediscloud).
1. Based on the language/framework you want to use, you will find the following client libraries:
    - [Redis OM .NET (C#)](https://github.com/redis/redis-om-dotnet)
        - Watch this [getting started video](https://www.youtube.com/watch?v=ZHPXKrJCYNA)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-dotnet/)
    - [Redis OM Node (JS)](https://github.com/redis/redis-om-node)
        - Watch this [getting started video](https://www.youtube.com/watch?v=KUfufrwpBkM)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-node/)
    - [Redis OM Python](https://github.com/redis/redis-om-python)
        - Watch this [getting started video](https://www.youtube.com/watch?v=PPT1FElAS84)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-python/)
    - [Redis OM Spring (Java)](https://github.com/redis/redis-om-spring)
        - Watch this [getting started video](https://www.youtube.com/watch?v=YhQX8pHy3hk)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-spring/)

The above videos and guides should be enough to get you started in your desired language/framework. From there you can expand and develop your app. Use the resources below to help guide you further:

1. [Developer Hub](https://redis.info/devhub) - The main developer page for Redis, where you can find information on building using Redis with sample projects, guides, and tutorials.
1. [Redis Stack getting started page](https://redis.io/docs/stack/) - Lists all the Redis Stack features. From there you can find relevant docs and tutorials for all the capabilities of Redis Stack.
1. [Redis Rediscover](https://redis.com/rediscover/) - Provides use-cases for Redis as well as real-world examples and educational material
1. [RedisInsight - Desktop GUI tool](https://redis.info/redisinsight) - Use this to connect to Redis to visually see the data. It also has a CLI inside it that lets you send Redis CLI commands. It also has a profiler so you can see commands that are run on your Redis instance in real-time
1. Youtube Videos
    - [Official Redis Youtube channel](https://redis.info/youtube)
    - [Redis Stack videos](https://www.youtube.com/watch?v=LaiQFZ5bXaM&list=PL83Wfqi-zYZFIQyTMUU6X7rPW2kVV-Ppb) - Help you get started modeling data, using Redis OM, and exploring Redis Stack
    - [Redis Stack Real-Time Stock App](https://www.youtube.com/watch?v=mUNFvyrsl8Q) from Ahmad Bazzi
    - [Build a Fullstack Next.js app](https://www.youtube.com/watch?v=DOIWQddRD5M) with Fireship.io
    - [Microservices with Redis Course](https://www.youtube.com/watch?v=Cy9fAvsXGZA) by Scalable Scripts on freeCodeCamp
