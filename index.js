const readline = require("readline");
const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");
const axios = require("axios");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Masukkan token bot Anda: ", (token) => {
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
    fs.readdirSync("./commands").filter(file => file.endsWith(".js")).forEach(file => {
        const command = require(`./commands/${file}`);
        commands.push(command);
        console.log(`Loaded command: ${command.name}`);
    });

    client.login(token)
        .then(() => rl.close()) // Menutup input setelah login sukses
        .catch(console.error);
});
