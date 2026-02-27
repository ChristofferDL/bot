const https = require("https");

https.get("https://discord.com/api/v10/gateway", (res) => {
  console.log("HTTP STATUS:", res.statusCode);
}).on("error", (err) => {
  console.error("HTTP ERROR:", err);
});
