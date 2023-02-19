const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }
  if (!event.partitionKey) {
    return crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
  }
  const partitionKey = typeof event.partitionKey === "string" ? 
    event.partitionKey : 
    JSON.stringify(event.partitionKey);

  if (partitionKey.length <= MAX_PARTITION_KEY_LENGTH) {
    return partitionKey;
  }
  return crypto.createHash("sha3-512").update(partitionKey).digest("hex");
};
