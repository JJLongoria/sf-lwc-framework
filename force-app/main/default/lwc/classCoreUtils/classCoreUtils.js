import { LightningElement } from 'lwc';

/**
 * Class with JavaScript core util methods like methods to check datatypes, force arrays, clone objects, check nulls...
 */
export default class CoreUtils extends LightningElement {

    /**
     * Method to force to put the data into an array if the data must be an array
     * @param {Object} data Data to force be an array
     * 
     * @returns {Array<Object>} Returns an array with the data or undefined if data is undefined
     */
    static forceArray(data) {
        if (data === undefined)
            return data;
        return (Array.isArray(data)) ? data : [data];
    }

    /**
     * Method to clone an object
     * @param {Object} obj Object to clone
     * 
     * @returns {Object} Returns the cloned object
     */
    static clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Method to check if the value is an object
     * @param {Object} value Value to check
     * 
     * @returns {Boolean} true if the value is an object, false in otherwise
     */
    static isObject(value) {
        return !CoreUtils.isArray(value) && typeof value === 'object';
    }

    /**
     * Method to check if the value is a string
     * @param {Object} value Value to check
     * 
     * @returns {Boolean} true if the value is a string, false in otherwise
     */
    static isString(value) {
        return !CoreUtils.isNull(value) && typeof value === 'string';
    }

    /**
     * Method to check if the value is a number
     * @param {Object} value Value to check
     * 
     * @returns {Boolean} true if the value is a number, false in otherwise
     */
    static isNumber(value) {
        return !CoreUtils.isNull(value) && typeof value === 'number';
    }

    /**
     * Method to check if the value is a BigInt
     * @param {Object} value Value to check
     * 
     * @returns {Boolean} true if the value is a BigInt, false in otherwise
     */
    static isBigInt(value) {
        return !CoreUtils.isNull(value) && typeof value === 'bigint';
    }

    /**
     * Method to check if the value is a symbol
     * @param {Object} value Value to check
     * 
     * @returns {Boolean} true if the value is a symbol, false in otherwise
     */
    static isSymbol(value) {
        return !CoreUtils.isNull(value) && typeof value === 'symbol';
    }

    /**
     * Method to check if the value is a boolean
     * @param {Object} value Value to check
     * 
     * @returns {Boolean} true if the value is a boolean, false in otherwise
     */
    static isBoolean(value) {
        return !CoreUtils.isNull(value) && typeof value === 'boolean';
    }

    /**
     * Method to check if the value is a function
     * @param {Object} value Value to check
     * 
     * @returns {Boolean} true if the value is a function, false in otherwise
     */
    static isFunction(value) {
        return !CoreUtils.isNull(value) && typeof value === 'function';
    }

    /**
     * Method to check if the value is an array
     * @param {Object} value Value to check
     * 
     * @returns {Boolean} true if the value is an array, false in otherwise
     */
    static isArray(value) {
        return !CoreUtils.isNull(value) && Array.isArray(value);
    }

    /**
     * Method to check if the value is null or undefined
     * @param {Object} value Value to check
     * 
     * @returns {Boolean} true if the value is null or undefined, false in otherwise
     */
    static isNull(value) {
        return value === undefined || value === null;
    }

    /**
     * Method to check if an object has keys
     * @param {Object} value Object to check
     * 
     * @returns {Boolean} true if the object has keys, false in otherwise
     */
    static hasKeys(value) {
        return !CoreUtils.isNull(value) && CoreUtils.isObject(value) && Object.keys(value).length > 0;
    }

    /**
     * Method to check if an object has specific key
     * @param {Object} value Object to check
     * 
     * @returns {Boolean} true if the object has the key, false in otherwise
     */
    static hasKey(object, key) {
        return !CoreUtils.isNull(object) && CoreUtils.isObject(object) && Object.keys(object).length > 0 && Object.keys(object).includes(key);
    }

    /**
     * Method to check if an object has keys
     * @param {Object | Array} value Object or array to check
     * 
     * @returns {Boolean} true if the object has keys, false in otherwise
     */
    static hasElements(value) {
        if (CoreUtils.isObject(value)) {
            return CoreUtils.hasKeys(value);
        } else if (CoreUtils.isArray(value)) {
            return value.length > 0;
        }
        return false;
    }

    /**
     * Method to count the keys from an object
     * @param {Object} value Object to get the keys
     * 
     * @returns {Number} Returns the keys from the object
     */
    static countKeys(value) {
        return (CoreUtils.hasKeys(value)) ? Object.keys(value).length : 0;
    }

    /**
     * Method to get the first element from an object
     * @param {Object} value Object to get the first element
     * 
     * @returns {Object} Returns the first element data
     */
    static getFirstElement(value) {
        return (CoreUtils.hasKeys(value)) ? value[Object.keys(value)[0]] : 0;
    }

    /**
     * Method to get the last element from an object
     * @param {Object} value Object to get the last element
     * 
     * @returns {Object} Returns the last element data
     */
    static getLastElement(value) {
        return (CoreUtils.hasKeys(value)) ? value[Object.keys(value)[Object.keys(value).length - 1]] : 0;
    }

    /**
     * Method to get the callback function from function arguments
     * @param {arguments} args function arguments to get the callback
     * 
     * @returns {Function} Returns a function if exists, or undefined if not exists. 
     */
    static getCallbackFunction(args) {
        if (CoreUtils.isNull(args) || args.length == 0)
            return undefined;
        for (let i = 0; i < args.length; i++) {
            if (CoreUtils.isFunction(args[i]))
                return args[i];
        }
        return undefined;
    }

    /**
     * Method to sort an Array. You can use fields from elements to sort and sort with case sensitive or insensitive
     * @param {Array<any>} elements Array with the elements to sort
     * @param {Array<String>} [fields] fields from child to sort
     * @param {Boolean} [caseSensitive] true if want sort data with case sensitive
     * 
     * @returns {Array<any>} Returns the array sorted
     */
    static sort(elements, fields, caseSensitive) {
        if (Array.isArray(elements) && elements.length > 0) {
            elements.sort(function (a, b) {
                if (fields && fields.length > 0) {
                    let nameA = '';
                    let nameB = '';
                    let counter = 0;
                    for (const field of fields) {
                        let valA = (a[field] !== undefined) ? a[field] : "";
                        let valB = (b[field] !== undefined) ? b[field] : "";
                        if (counter == 0) {
                            nameA = valA;
                            nameB = valB;
                        } else {
                            nameA += '_' + valA;
                            nameB += '_' + valB;
                        }
                        counter++;
                    }
                    if (CoreUtils.isNumber(nameA) && CoreUtils.isNumber(nameB)) {
                        if (nameA > nameB) {
                            return 1;
                        } else if (nameA < nameB) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else {
                        nameA = '' + nameA;
                        nameB = '' + nameB;
                        if (caseSensitive) {
                            return nameA.localeCompare(nameB);
                        } else {
                            return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
                        }
                    }
                } else {
                    if (caseSensitive) {
                        return a.localeCompare(b);
                    } else {
                        return a.toLowerCase().localeCompare(b.toLowerCase());
                    }
                }
            });
        }
        return elements;
    }

}