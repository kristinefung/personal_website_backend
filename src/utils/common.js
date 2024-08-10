module.exports = {
    getRandomString: (length) => {
        let str = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            str += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return str;
    },
    toISODate: (d) => {
        const dateArr = d.split('/');
        const year = Number(dateArr[0]);
        const month = Number(dateArr[1]);

        const date = new Date(year, month - 1, 1);

        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
}