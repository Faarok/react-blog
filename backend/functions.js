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
     * Check if Array is an array and is empty
     *
     * @param {array} array
     * @returns {boolean}               true if empty or is not an array, otherwise false
     */
    isArrayEmpty: function(array) {
        if(!Array.isArray(array))
            return true;

        return array.length === 0;
    },
    /**
     * Check if Object is an object and is empty
     *
     * @param {object} object
     * @returns {boolean}               true if empty or is not an object, otherwise false
     */
    isObjectEmpty: function(object) {
        if(typeof object !== 'object')
            return true;

        return Object.keys(object).length === 0;
    },
    isNumberInt: function (value) {
        return Number.isInteger(Number(value)) && /^-?\d+$/.test(String(value));
    },
    isEmpty: function(value) {
        if(typeof value === 'string')
            return this.isStringEmpty(value);

        if(Array.isArray(value))
            return this.isArrayEmpty(value);

        if(typeof value === 'object')
            return this.isObjectEmpty(value);

        if(this.isNumberInt(value))
            return false; // Un nombre entier ne peut pas être vide

        return !value; // Pour les autres types (null, undefined, etc.)
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
     * Check if string is true (as bool)
     * @param {string} str
     * @returns {boolean}
     */
    strToBool: function(str)
    {
        return str === 'true';
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
     * @returns {boolean}
     */
    validatePassword: function(password) {
        if(this.isStringEmpty(password))
            return false;

        const passwordRegex = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[/!@#$%^&*(),.?":{}|<>]).{8,32}$/;

        return passwordRegex.test(password);
    }
}

const dataState = {
    ACTIVE: 'published',
    DELETED: 'deleted',
    ARCHIVED: 'archived'
}

export { tools, dataState };