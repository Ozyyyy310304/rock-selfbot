module.exports = {
    name: 'stop',
    description: 'Menghentikan semua command yang berjalan.',
    execute(channel, message, client, args) {
        global.isStopped = true; // Menghentikan semua proses
    }
};
