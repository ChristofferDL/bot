console.log("TOKEN EXISTS:", !!TOKEN);
console.log("GUILD ID:", GUILD_ID);

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN) {
  console.error("DISCORD_TOKEN missing");
  process.exit(1);
}

if (!GUILD_ID) {
  console.error("GUILD_ID missing");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

app.get("/api/stats", async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.members.fetch();

    const totalMembers = guild.memberCount;

    const onlineMembers = guild.members.cache.filter(
      m => m.presence?.status === "online"
    ).size;

    res.json({ totalMembers, onlineMembers });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/api/member/:id", async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(req.params.id);

    res.json({
      id: member.id,
      username: member.user.username,
      avatar: member.user.displayAvatarURL(),
      joinedAt: member.joinedAt
    });
  } catch (err) {
    res.status(404).json({ error: "Member not found" });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

client.login(TOKEN)
  .then(() => console.log("Login successful"))
  .catch(err => console.error("Login failed:", err));
