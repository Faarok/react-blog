import fs from 'fs';
import moment from 'moment-timezone';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const timezone = 'Europe/Paris';

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
    },
    /**
     * Return the current date in YYYY-MM-DD HH:mm:ss format
     * timezone is set at top of the file
     *
     * @returns {string}
     */
    dateNow: function() {
        moment.tz.setDefault(timezone);
        return moment().format('YYYY-MM-DD HH:mm:ss');
    },
    /**
     * Allow to add log to whatever you want.
     * Create folder "log" if don't exist.
     * Create file if don't exist.
     * @param {string} content         err.stack, err.message, for example
     * @param {string} scope='error'   E.g : 'sql' will create an 'log/sql.log' file
     * @param {string} type='info'     Type of log
     * @returns {void}
     */
    log: function(content, scope = 'error', type = 'info') {
        if(this.isStringEmpty(content))
            return this.log('Error when inserting a log: empty content', 'error', 'ERROR');

        if(this.isStringEmpty(scope))
            return this.log('Error when inserting a log: empty scope', 'error', 'ERROR');

        if(this.isStringEmpty(type))
            return this.log('Error when inserting a log: empty type', 'error', 'ERROR');

        type = type.trim().toUpperCase();
        let currentDate = this.dateNow();
        let logDir = path.join(__dirname, 'logs');

        if(!fs.existsSync(logDir))
            fs.mkdirSync(logDir, { recursive: true });

        let logFilePath = path.join(logDir, `${scope}.log`)

        fs.appendFile(logFilePath, `${currentDate} | ${type} | ${content}\n`, (appendError) => {
            if(appendError)
                return this.log(appendError, 'error', 'error');
        });
    }
}

const dataState = {
    ACTIVE: 'published',
    DELETED: 'deleted',
    ARCHIVED: 'archived'
}

const permissionRange = {
    OWN: 'own',
    ALL: 'all'
};

export { tools, dataState, permissionRange };