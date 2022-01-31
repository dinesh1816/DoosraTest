require("babel-core/register");
require("babel-polyfill");
const deleteUsers = require("./DeleteData");

async function main() {
  await deleteUsers();
  process.exit(1);
}

main();
