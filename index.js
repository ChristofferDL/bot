const { Client, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;

console.log("TOKEN EXISTS:", !!TOKEN);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.on("ready", () => {
  console.log("READY:", client.user.tag);
});

client.on("error", console.error);

client.login(TOKEN);
