const UUID = require("uuid-1345");
const fs = require("fs");

function nextUUID() {
  return UUID.v3({
    namespace: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    name: Date.now().toString(),
  });
}
function generateRuntimeId() {
  return +Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
}
function loadJsonFromFileSync(path) {
  try {
    const jsonData = fs.readFileSync(path, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error loading JSON:", error);
    return null;
  }
}
module.exports = { nextUUID, generateRuntimeId, loadJsonFromFileSync };
