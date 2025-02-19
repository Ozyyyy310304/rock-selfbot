const readline = require("readline");
const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");
const axios = require("axios");

// Coba baca token dari config.json
let config;
try {
    config = require("./config.json");
} catch (error) {
    console.error("config.json tidak ditemukan. Pastikan file config.json sudah ada di root project.");
    process.exit(1);
}

// Fungsi untuk memulai bot
function startBot(token) {
    const client = new Client();
    const commands = [];
    const prefix = "!"; // Ganti sesuai kebutuhan

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`);
    });

    client.on("messageCreate", (message) => {
        if (!message.author || message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = commands.find(cmd => cmd.name === commandName);
        
        if (!command) return;

        // Eksekusi command tanpa batasan user
        command.execute(message.channel, message, client, args);
        console.log(`Executed command: ${commandName} ✅`);
    });

    // Load command files
    fs.readdirSync("./commands")
      .filter(file => file.endsWith(".js"))
      .forEach(file => {
          const command = require(`./commands/${file}`);
          commands.push(command);
          console.log(`Loaded command: ${command.name}`);
      });

    client.login(token).catch(console.error);
}

// Jika token sudah ada di config.json (tidak kosong), gunakan token tersebut
if (config.BOT_TOKEN && config.BOT_TOKEN.trim() !== "") {
    startBot(config.BOT_TOKEN);
} else {
    // Jika belum ada token, minta input dari terminal
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("Masukkan token bot Anda: ", (inputToken) => {
        // Simpan token ke config.json agar tidak perlu input ulang di sesi berikutnya
        config.BOT_TOKEN = inputToken;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
        rl.close();
        startBot(inputToken);
    });
}
