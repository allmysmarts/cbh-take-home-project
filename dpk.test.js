const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

const generateRawTexts = (length) => Array(length + 1).join("a")

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no or falsy input", () => {
    expect(deterministicPartitionKey()).toBe("0");
    expect(deterministicPartitionKey("")).toBe("0");
    expect(deterministicPartitionKey(null)).toBe("0");
    expect(deterministicPartitionKey(false)).toBe("0");
    expect(deterministicPartitionKey(0)).toBe("0");
  });

  it("Returns the hashing result of parameter when given truthy input, but no or falsy `partitionKey`", () => {
    const textParam = "text parameter";
    const hashOfTextParam = crypto.createHash("sha3-512").update(JSON.stringify(textParam)).digest("hex");
    expect(deterministicPartitionKey(textParam)).toBe(hashOfTextParam);

    const numberParam = 123
    const hashOfNumberParam = crypto.createHash("sha3-512").update(JSON.stringify(numberParam)).digest("hex");
    expect(deterministicPartitionKey(numberParam)).toBe(hashOfNumberParam);

    const trueParam = true
    const hashOfTrueParam = crypto.createHash("sha3-512").update(JSON.stringify(true)).digest("hex");
    expect(deterministicPartitionKey(trueParam)).toBe(hashOfTrueParam);

    const objParam1 = {}
    const hashOfObjParam1 = crypto.createHash("sha3-512").update(JSON.stringify({})).digest("hex");
    expect(deterministicPartitionKey(objParam1)).toBe(hashOfObjParam1);

    const objParam2 = { noPartitionKey: "AnyValue" }
    const hashOfObjParam2 = crypto.createHash("sha3-512").update(JSON.stringify(objParam2)).digest("hex");
    expect(deterministicPartitionKey(objParam2)).toBe(hashOfObjParam2);

    const objParam3 = { partitionKey: 0 }
    const hashOfObjParam3 = crypto.createHash("sha3-512").update(JSON.stringify(objParam3)).digest("hex");
    expect(deterministicPartitionKey(objParam3)).toBe(hashOfObjParam3);
  });

  it("Returns the raw partitionKey of parameter as stringified when given less than 256 characters length", () => {
    const param1 = { partitionKey: 1 }
    expect(deterministicPartitionKey(param1)).toBe(JSON.stringify(param1.partitionKey));

    const param2 = { partitionKey: {} }
    expect(deterministicPartitionKey(param2)).toBe(JSON.stringify(param2.partitionKey));

    const param3 = { partitionKey: "1" }
    expect(deterministicPartitionKey(param3)).toBe("1");

    const param4 = { partitionKey: generateRawTexts(256)}
    expect(param4.partitionKey.length).toBe(256)
    expect(deterministicPartitionKey(param4)).toBe(param4.partitionKey);
  });

  it("Returns the hashing result of partitionKey parameter when given more than 256 characters length", () => {
    const param = { partitionKey: generateRawTexts(257)}
    expect(param.partitionKey.length).toBe(257)
    const hashOfPartitionKey = crypto.createHash("sha3-512").update(param.partitionKey).digest("hex");
    expect(deterministicPartitionKey(param)).toBe(hashOfPartitionKey);
  });
});
