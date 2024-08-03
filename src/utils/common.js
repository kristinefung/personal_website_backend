module.exports = {
    getRandomString: (length) => {
        let str = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            str += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return str;
    },
    isValidDate: (date) => {
        const regex = /^(\d{4})(\/)(\d{2})$/;
        if (date.match(regex) == null) {
            return false;
        }

        const dateArr = date.split('/');
        const year = Number(dateArr[0]);
        const month = Number(dateArr[1]);

        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
            return false;
        }
        if (month < 1 || month > 12) {
            return false;
        }

        return true;
    },
    toISODate: (d) => {
        const dateArr = d.split('/');
        const year = Number(dateArr[0]);
        const month = Number(dateArr[1]);

        const date = new Date(year, month - 1, 1);

        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
}