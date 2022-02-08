require("@babel/register");
require("regenerator-runtime/runtime");
require("core-js/stable");

const deleteUsers = require("./DeleteData");

async function main() {
  await deleteUsers();
  process.exit(1);
}

main();
