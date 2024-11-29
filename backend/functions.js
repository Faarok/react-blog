const tools = {
    /**
     * Check if String is a string and is empty
     *
     * @param {string} string
     * @param {boolean} falsy=false     If true, also check for falsy data (https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
     * @returns {boolean}               true if empty or is not a string, otherwise, false
     */
    isStringEmpty: function(string, falsy = false) {
        if(typeof string !== 'string')
            return true;

        if(falsy)
            return !string || string.trim().length === 0;

        return string.trim().length === 0;
    },
    /**
     * Check if string is a well formated mail address
     *
     * @param {string} mail
     * @returns {boolean}
     */
    validateEmail: function(mail) {
        if(this.isStringEmpty(mail))
            return false;

        const emailRegex = /^[a-zA-Z0-9](?!.*[._+-]{2})[a-zA-Z0-9._+-]*[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return (emailRegex.test(mail.trim()));
    },
    /**
     * Check if string is a well formated password
     * - Lower case
     * - Upper case
     * - Number
     * - Special char
     * - No spaces
     * - Length min : 8 / Length max : 32
     *
     * @param {string} password
     * @returns {any}
     */
    validatePassword: function(password) {
        if(this.isStringEmpty(password))
            return false;

        const passwordRegex = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,32}$/;

        return passwordRegex.test(password);
    }
}

export default tools;