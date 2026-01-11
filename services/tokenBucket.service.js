const redisClient = require("../redis/client.js");
const fs = require("fs");
const path = require("path");

const luaScript = fs.readFileSync(
  path.resolve(__dirname, "../redis/scripts/tokenBucket.lua"),
  "utf8"
);

const checkRateLimit = async ({ key, capacity, refillrate }) => {
  const now = Math.ceil(Date.now() / 1000);

  const result = await redisClient.eval(luaScript, {
    keys: [`ratelimit:${key}`],
    arguments: [`${capacity}`, `${refillrate}`, `${now}`],
  });

  return {
    allowed: result[0] === 1,
    remaining: result[1],
  };
};

module.exports = { checkRateLimit };
