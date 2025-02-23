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
    console.error("❌ config.json tidak ditemukan. Pastikan file config.json sudah ada di root project.");
    process.exit(1);
}

// Fungsi untuk memulai bot
function startBot(token) {
    const client = new Client();
    const commands = [];
    const prefix = "!"; // Ganti sesuai kebutuhan

    client.on("ready", () => {
        console.log(`✅ Logged in as ${client.user.tag}`);
    });

    client.on("messageCreate", (message) => {
        if (!message.author || message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        // ✅ Cek apakah yang mengirim command adalah OWNER
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

    // ✅ Load command files dari folder "commands"
    fs.readdirSync("./commands")
      .filter(file => file.endsWith(".js"))
      .forEach(file => {
          const command = require(`./commands/${file}`);
          commands.push(command);
          console.log(`🔹 Loaded command: ${command.name}`);
      });

    // ✅ Login menggunakan token dari config.json
    client.login(token).catch(err => {
        console.error("❌ Gagal login! Periksa kembali token di config.json.", err);
    });
}

// ✅ Jika token sudah ada di config.json, langsung jalankan bot
if (config.BOT_TOKEN && config.BOT_TOKEN.trim() !== "") {
    startBot(config.BOT_TOKEN);
} else {
    // Jika belum ada token, minta input manual
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
