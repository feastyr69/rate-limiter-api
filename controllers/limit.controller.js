const { checkRateLimit } = require("../services/tokenBucket.service.js");

const limitCheck = async (req, res) => {
  const { key, rule } = req.body;
  const capacity = rule.capacity;
  const refillrate = rule.refillrate;

  const result = await checkRateLimit({
    key,
    capacity,
    refillrate,
  });
  console.log(result);
  res.json(result);
};

module.exports = { limitCheck };
