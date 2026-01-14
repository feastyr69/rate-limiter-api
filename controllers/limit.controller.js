const { checkRateLimit } = require("../services/tokenBucket.service.js");

const limitCheck = async (req, res) => {
  const { rule } = req.body;
  const capacity = rule.capacity;
  const refillrate = rule.refillrate;
  const apiKey = req.headers["x-api-key"] || "default";

  const result = await checkRateLimit({
    key: `ip:${req.ip}:api:${apiKey}`,
    capacity,
    refillrate,
  });
  console.log(result);
  res.json(result);
};

module.exports = { limitCheck };
