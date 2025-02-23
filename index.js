const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");

// Coba baca token dan owner ID dari config.json
let config;
try {
    config = require("./config.json");
} catch (error) {
    console.error("❌ config.json tidak ditemukan. Pastikan file config.json sudah ada di root project.");
    process.exit(1);
}

const { BOT_TOKEN, OWNER_ID } = config;

if (!BOT_TOKEN || !OWNER_ID) {
    console.error("❌ BOT_TOKEN atau OWNER_ID belum diatur di config.json!");
    process.exit(1);
}

const client = new Client();
const commands = [];
const prefix = "!"; // Ganti sesuai kebutuhan

client.on("ready", () => {
    console.log(`✅ Bot aktif sebagai ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    if (!message.author || message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    // Cek apakah user yang mengirim command adalah OWNER
    if (message.author.id !== OWNER_ID) {
        console.log(`⚠️ ${message.author.tag} mencoba menggunakan command, tapi bukan owner!`);
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = commands.find(cmd => cmd.name === commandName);
    
    if (!command) return;

    command.execute(message.channel, message, client, args);
    console.log(`✅ Executed command: ${commandName}`);
});

// Load command files dari folder "commands"
fs.readdirSync("./commands")
  .filter(file => file.endsWith(".js"))
  .forEach(file => {
      const command = require(`./commands/${file}`);
      commands.push(command);
      console.log(`🔹 Loaded command: ${command.name}`);
  });

// Login menggunakan token dari config.json
client.login(BOT_TOKEN).catch(err => {
    console.error("❌ Gagal login! Periksa kembali BOT_TOKEN di config.json.", err);
});
