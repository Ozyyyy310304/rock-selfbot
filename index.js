const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");

// ✅ Atur OWNER_ID langsung di kode ini
const OWNER_ID = "1312048022074691669"; // Ganti dengan ID kamu sendiri

// ✅ Ambil token dari file di root HP (misalnya "token.txt")
let BOT_TOKEN;
try {
    BOT_TOKEN = fs.readFileSync("./config.json", "utf8").trim();
} catch (error) {
    console.error("❌ Gagal membaca token dari token.txt! Pastikan file ada di root HP.");
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

// Login menggunakan token dari file di root HP
client.login(BOT_TOKEN).catch(err => {
    console.error("❌ Gagal login! Periksa kembali token di token.txt.", err);
});
