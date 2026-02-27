const { Client, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;

console.log("TOKEN EXISTS:", !!TOKEN);

if (!TOKEN) {
  console.error("NO TOKEN");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.on("ready", () => {
  console.log("READY EVENT FIRED");
  console.log("Logged in as:", client.user.tag);
});

client.on("error", (err) => {
  console.error("CLIENT ERROR:", err);
});

client.login(TOKEN)
  .then(() => console.log("LOGIN PROMISE RESOLVED"))
  .catch(err => console.error("LOGIN FAILED:", err));
