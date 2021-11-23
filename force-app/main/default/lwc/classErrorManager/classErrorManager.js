/**
 * Class to handle any error on LWC components
 */
export default class ErrorManager  {

    /**
     * Method to analize any error (Aura Exception or JavaScript errors)
     * and make a single response to work with errors easy because all errors has the same fields. Unified error object:
     * 
     *      {
     *           name: String,      // Error name to identify it
     *           message: String,   // Error message
     *           data: Object,      // Error data
     *           type: 'Apex | JS', // Error type like Apex or JS
     *           stack: Object      // Error Stack trace
     *      }
     * 
     * @param {Object} error Error data to analyze
     * 
     * @returns {Object} Return the unified error object.
     */
    static getError(error){
        let result = {
            name: undefined,
            message: undefined,
            data: undefined,
            type: undefined,
            stack: undefined
        };
        if(error.body && error.body.message && error.body.message.indexOf('from') != -1){
            result = JSON.parse(error.body.message);
        } else {
            result.name = error.name;
            result.message = error.message;
            result.data = undefined;
            result.stack = error.stack;
            result.type = 'JS';
        }
        return result;
    }

}