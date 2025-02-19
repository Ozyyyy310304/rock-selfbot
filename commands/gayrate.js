module.exports = {
    name: 'gayrate',
    description: 'Rates how gay a user is.',
    execute(channel, message, client, args) {
        let member;

        // Cek apakah ada mention atau ambil pengguna yang mengirim pesan jika tidak ada mention
        if (message.mentions.members.size > 0) {
            member = message.mentions.members.first();
        } else if (args.length > 0) {
            // Coba ambil user berdasarkan ID atau username (jika disebut tanpa mention)
            member = message.guild.members.cache.get(args[0]) || 
                     message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLowerCase());
        } else {
            member = message.member; // Default ke pengirim pesan jika tidak ada mention
        }

        if (!member) {
            return message.channel.send('Please mention a valid user to rate their gayness.');
        }

        // Generate a random gayness rating between 0 and 100
        const gayness = Math.floor(Math.random() * 101);

        // Send the gayness rating to the channel
        message.channel.send(`${member.user.username} is ${gayness}% gay.`);
    }
};
