const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN) {
  console.error("DISCORD_TOKEN is missing.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

let guildCache = null;

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    guildCache = await client.guilds.fetch(GUILD_ID);
    await guildCache.members.fetch();
    console.log("Guild cache loaded.");
  } catch (err) {
    console.error("Guild fetch failed:", err);
  }
});

app.get("/api/stats", async (req, res) => {
  if (!guildCache) {
    return res.json({ error: "Guild not ready" });
  }

  const totalMembers = guildCache.memberCount;

  const onlineMembers = guildCache.members.cache.filter(
    member => member.presence?.status === "online"
  ).size;

  res.json({
    totalMembers,
    onlineMembers
  });
});

app.get("/api/member/:id", async (req, res) => {
  try {
    const member = await guildCache.members.fetch(req.params.id);

    res.json({
      id: member.id,
      username: member.user.username,
      avatar: member.user.displayAvatarURL(),
      joinedAt: member.joinedAt
    });
  } catch (error) {
    res.status(404).json({ error: "Member not found" });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

client.login(TOKEN);