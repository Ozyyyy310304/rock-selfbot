module.exports = {
    name: "clear",
    description: "Delete messages from the bot in a channel",
    /**
     * @param {Channel} channel The channel where the command was executed.
     * @param {Message} message The message object for the command.
     * @param {Client} client The client or bot instance.
     */
    async execute(channel, message, client) {
        try {
            // Ambil jumlah pesan yang ingin dihapus dari args (default: 99)
            const args = message.content.split(/\s+/).slice(1);
            const number = !isNaN(parseInt(args[0], 10)) ? Math.min(parseInt(args[0], 10), 100) : 99;

            // Hapus pesan perintah terlebih dahulu
            await message.delete().catch(() => {});

            // Ambil pesan dalam jumlah yang ditentukan
            const messages = await channel.messages.fetch({ limit: number });
            const botMessages = messages.filter(msg => msg.author.id === client.user.id);

            let deletedCount = 0;
            for (const msg of botMessages.values()) {
                if (deletedCount >= number) break;
                await msg.delete().catch(() => {});
                deletedCount++;
            }
        } catch (error) {
            console.error("Error deleting messages:", error);
        }
    }
};
