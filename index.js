const readline = require("readline");
const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");

// 🔹 Coba baca config.json
let config;
try {
    config = require("./config.json");
} catch (error) {
    console.error("❌ config.json tidak ditemukan. Pastikan file config.json ada di root project.");
    process.exit(1);
}

// 🔹 Ambil token & OWNER_ID dari config.json
const BOT_TOKEN = config.BOT_TOKEN ? config.BOT_TOKEN.trim() : null;
const OWNER_ID = config.OWNER_ID ? config.OWNER_ID.trim() : null;

// 🔹 Fungsi untuk memulai bot
function startBot(token) {
    if (!OWNER_ID) {
        console.error("❌ OWNER_ID tidak ditemukan di config.json!");
        process.exit(1);
    }

    const client = new Client();
    const commands = [];
    const prefix = "!"; // Ubah jika perlu

    client.on("ready", () => {
        console.log(`✅ Bot aktif sebagai ${client.user.tag}`);
    });

    client.on("messageCreate", (message) => {
        if (!message.author || message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        // 🔹 Cek apakah yang menggunakan command adalah OWNER
        if (message.author.id !== OWNER_ID) {
            console.log(`⚠️ ${message.author.tag} (${message.author.id}) mencoba menggunakan command, tetapi bukan owner!`);
            return;
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = commands.find(cmd => cmd.name === commandName);
        
        if (!command) return;

        command.execute(message.channel, message, client, args);
        console.log(`✅ Executed command: ${commandName}`);
    });

    // 🔹 Load semua command dari folder "commands"
    fs.readdirSync("./commands")
      .filter(file => file.endsWith(".js"))
      .forEach(file => {
          const command = require(`./commands/${file}`);
          commands.push(command);
          console.log(`🔹 Loaded command: ${command.name}`);
      });

    // 🔹 Login bot menggunakan token
    client.login(token).catch(err => {
        console.error("❌ Gagal login! Periksa kembali token di config.json.", err);
    });
}

// 🔹 Jika token sudah ada di config.json, gunakan
if (BOT_TOKEN) {
    startBot(BOT_TOKEN);
} else {
    // 🔹 Jika belum ada token, minta input dari terminal
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("Masukkan token bot Anda: ", (inputToken) => {
        config.BOT_TOKEN = inputToken;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
        rl.close();
        startBot(inputToken);
    });
}
