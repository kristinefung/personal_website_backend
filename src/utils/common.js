module.exports = {
    getRandomString: (length) => {
        var str = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            str += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return str
    }
}