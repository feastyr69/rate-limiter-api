-- KEYS[1] bucket key
-- ARGV[1] capacity
-- ARGV[2] refill rate
-- ARGV[3] time now

local bucket = redis.call("HMGET",KEYS[1],"tokens","lastRefill")
local tokens = tonumber(bucket[1]) or ARGV[1]
local lastRefill = tonumber(bucket[2]) or ARGV[3]

local delta = ARGV[3] - lastRefill
local refill = delta * ARGV[2]
tokens = math.min(tonumber(ARGV[1]), tokens + refill)

local allowed = 0
if tokens >= 1 then
  tokens = tokens - 1
  allowed = 1
end

redis.call("HMSET",KEYS[1],"tokens",tokens,"lastRefill",ARGV[3])
redis.call("EXPIRE",KEYS[1],math.ceil(ARGV[1]/ARGV[2]))

return {allowed,tokens}