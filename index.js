const readline = require("readline");
const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");
const axios = require("axios");

// ✅ ID Owner (hanya user ini yang bisa menggunakan command)
const OWNER_ID = "1312048022074691669"; // Ganti dengan ID kamu sendiri

// ✅ Baca token dari config.json
let config;
try {
    config = require("./config.json");
} catch (error) {
    process.exit(1); // Hentikan jika config.json tidak ada
}

// Fungsi untuk memulai bot
function startBot(token) {
    const client = new Client();
    const commands = [];
    const prefix = "!"; // Ganti sesuai kebutuhan

    client.on("messageCreate", async (message) => {
        if (!message.author || message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        // ✅ Cek apakah yang mengirim command adalah OWNER
        if (message.author.id !== OWNER_ID) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // ✅ Jika command adalah "!stop", hapus pesan & hentikan bot tanpa notifikasi
        if (commandName === "stop") {
            try {
                await message.delete().catch(() => {}); // Hapus pesan !stop
                client.destroy(); // Logout dari Discord
                process.exit(0); // Hentikan proses bot
            } catch (err) {
                console.error("❌ Gagal mengeksekusi !stop:", err);
            }
            return;
        }

        const command = commands.find(cmd => cmd.name === commandName);
        if (!command) return;

        command.execute(message.channel, message, client, args);
    });

    // ✅ Load command files dari folder "commands"
    fs.readdirSync("./commands")
      .filter(file => file.endsWith(".js"))
      .forEach(file => {
          const command = require(`./commands/${file}`);
          commands.push(command);
      });

    // ✅ Login menggunakan token dari config.json
    client.login(token).catch(() => process.exit(1));
}

// ✅ Jika token sudah ada di config.json, langsung jalankan bot
if (config.BOT_TOKEN && config.BOT_TOKEN.trim() !== "") {
    startBot(config.BOT_TOKEN);
} else {
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
