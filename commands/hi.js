let isStopped = false; // Variabel global untuk menghentikan proses

module.exports = {
    name: 'hi',
    description: 'Mengirim hi, woi, hm, atau oh secara acak sebanyak 50 kali dengan jeda 13 detik.',
    async execute(channel, message, client, args) {
        isStopped = false;
        const texts = [
            "hi", "woi", "hm", "oh", "oh gitu oke", "sakit dadaku",
            "malam keos ini", "apcb😹", "goth girl are my tipes", 
            "p", "me=im going back to 505", "me=ayam", "ketika tubuh kita menderita,jiwa kita bangkit"
        ];

        for (let i = 0; i < 9999; i++) {
            if (isStopped) return; // Berhenti jika `!stop` dieksekusi
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            await channel.send(randomText);
            await new Promise(resolve => setTimeout(resolve, 13000)); // Cooldown 13 detik
        }
    }
};
