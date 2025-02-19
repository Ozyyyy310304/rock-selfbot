const fs = require("fs");
const path = require("path");

module.exports = {
    name: "help",
    description: "🚀 Displays a list of available commands.",
    
    execute(channel, message, client, args) {
        try {
            const { prefix } = require("../config");

            // Baca daftar file dalam folder commands
            const commandFiles = fs.readdirSync(path.resolve(__dirname, "../commands"))
                .filter(file => file.endsWith(".js"));

            let helpMessage = 
                "🚀 **Help - Available Commands**\n\n" +
                "*Created by Ozy*\n\n" + 
              "*instagram:@ozydelrey*\n\n";

            // Tambahkan setiap command ke daftar bantuan
            commandFiles.forEach(file => {
                try {
                    const command = require(`../commands/${file}`);
                    helpMessage += `:small_orange_diamond: **${prefix}${command.name}**: ${command.description}\n`;
                } catch (err) {
                    console.error(`Error loading command: ${file}`, err);
                }
            });

            helpMessage += "\n:man_technologist: *Created by ozyriel nathaniel*";

            // Bagi pesan jika terlalu panjang (Discord punya batasan 2000 karakter per pesan)
            const messages = helpMessage.match(/[\s\S]{1,2000}/g);
            messages.forEach(msg => {
                channel.send(msg).catch(err => {
                    console.error("Failed to send help message:", err);
                });
            });

        } catch (err) {
            console.error("Error executing help command:", err);
        }
    }
};
