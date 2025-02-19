module.exports = {
    name: 'hi',
    description: 'Mengirim hi, woi, hm, atau oh secara acak sebanyak 50 kali dengan jeda 13 detik.',
    async execute(channel, message, client, args) {
        const texts = ["hi", "woi", "hm", "oh", "oh gitu oke", "sakit dadaku", "malam keos ini", "apcb😹", "goth girl are my tipes", "p", "me=im going back to 505", "me=ayam"];

        for (let i = 0; i < 1000; i++) {
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            await channel.send(randomText);
            await new Promise(resolve => setTimeout(resolve, 13000)); // Cooldown 13 detik
        }
    }
};
