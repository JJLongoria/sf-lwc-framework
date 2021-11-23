import { LightningElement } from 'lwc';

/**
 * Class to handle all about strings like countn ocurrences, replace, check if contains...
 */
export default class StrUtils extends LightningElement {

    /**
     * Method to replace data from a string
     * @param {String} str String to replace the data
     * @param {String} replace String to replace
     * @param {String} replacement String to replacement
     * 
     * @returns {String} Returns the the String with data replaced
     */
    static replace(str, replace, replacement) {
        return str.split(replace).join(replacement);
    }

    /**
     * Method to count the ocurrences into the String
     * @param {String} str Source to check
     * @param {String} strToCheck String to check if exists on str
     * 
     * @returns {Number} true if "strToCheck" exists on "str", false in otherwise
     */
    static count(str, strToCheck) {
        return (str.match(new RegExp(strToCheck, 'g')) || []).length;
    }

    /**
     * Method to check if a String contains other String
     * @param {String} str Source to check
     * @param {String} strToCheck String to check if exists on str
     * 
     * @returns {Boolean} true if "strToCheck" exists on "str", false in otherwise
     */
    static contains(str, strToCheck) {
        return str.indexOf(strToCheck) !== -1;
    }

    /**
     * Method to check if a String contains other String ignoring letter case
     * @param {String} str Source to check
     * @param {String} strToCheck String to check if exists on str
     * 
     * @returns {Boolean} true if "strToCheck" exists on "str", false in otherwise
     */
    static containsIgnorecase(str, strToCheck) {
        return str.toLowerCase().indexOf(strToCheck.toLowerCase()) !== -1;
    }

    /**
     * Returns N tabs special characters (\t)
     * @param {Number} number Number of tabs (\t) to return
     * 
     * @returns {String} Return an string with the specified tabs
     */
    static getTabs(number) {
        let tabs = '';
        for (let index = 0; index < number; index++) {
            tabs += '\t';
        }
        return tabs;
    }

    /**
     * Returns N newline special characters (\n)
     * @param {Number} number Number of newlines (\n) to return
     * 
     * @returns {String} Return an string with the specified newlines
     */
    static getNewLines(number) {
        let nl = '';
        for (let index = 0; index < number; index++) {
            nl += '\n';
        }
        return nl;
    }

    /**
     * Returns N whitespaces
     * @param {Number} number Number of whitespaces to return
     * 
     * @returns {String} Return an string with the specified whitespaces
     */
    static getWhitespaces(number) {
        let ws = "";
        for (let i = 0; i < number; i++) {
            ws += ' ';
        }
        return ws;
    }

}