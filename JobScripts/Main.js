require("@babel/register");
require("regenerator-runtime/runtime");
require("core-js/stable");

const crontab = require("node-cron");
const DeleteData = require("./DeleteData/DeleteData");

// Remove posts every 10AM every day
crontab.schedule(
  "10 * * * *",
  () => {
    DeleteData.delete_posts();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  },
);
