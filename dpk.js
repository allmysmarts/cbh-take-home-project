const crypto = require("crypto");

/**
 * All subsequent `if` statements are easy to understand, and exclusive.
 * I can provide no more clear solution for this.
 */
exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  const hash = crypto.createHash("sha3-512");

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }
  if (!event.partitionKey) {
    return hash.update(JSON.stringify(event)).digest("hex");
  }
  const partitionKey = typeof event.partitionKey === "string" ? 
    event.partitionKey : 
    JSON.stringify(event.partitionKey);

  if (partitionKey.length <= MAX_PARTITION_KEY_LENGTH) {
    return partitionKey;
  }
  return hash.update(partitionKey).digest("hex");
};
