const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.DISCORD_TOKEN;

console.log("TOKEN EXISTS:", !!TOKEN);

if (!TOKEN) {
  console.error("DISCORD_TOKEN missing");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.on("ready", () => {
  console.log("READY:", client.user.tag);
});

client.on("error", console.error);

client.login(TOKEN);

// REQUIRED FOR RENDER
app.get("/", (req, res) => {
  res.send("Bot is running.");
});

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});
