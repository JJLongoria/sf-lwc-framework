
/**
 * Class to handle all about the HTML DOM
 */
export default class DOMUtils  {

    /**
     * Method to make any query selector using any html atribute
     * @param {Object} cmp LWC Component to query HTML Elements
     * @param {String} attribute HTML Attribute name
     * @param {String} value HTML Attribute value
     * 
     * @returns {Object | Array<Object>} Returns the HTML or LWC components
     */
    static querySelector(cmp, attribute, value){
        return cmp.template.querySelector('['+attribute+'="' + value + '"]');
    }

    /**
     * Method to query HTML Elements by id
     * @param {Object} cmp LWC Component to query HTML Elements
     * @param {String} idValue HTML attribute id value
     * 
     * @returns {Object} Returns the HTML or LWC component with the selected id
     */
    static queryById(cmp, idValue){
        return DOMUtils.querySelector(cmp, 'id', idValue);
    }

    /**
     * Method to query HTML Elements by name
     * @param {Object} cmp LWC Component to query HTML Elements
     * @param {String} nameValue HTML attribute name value
     * 
     * @returns {Object | Array<Object>} Returns the HTML or LWC component with the selected name
     */
    static queryByName(cmp, nameValue){
        return DOMUtils.querySelector(cmp, 'name', nameValue);
    }

    /**
     * Method to query HTML Elements by class
     * @param {Object} cmp LWC Component to query HTML Elements
     * @param {String} classValue HTML attribute class value
     * 
     * @returns {Object | Array<Object>} Returns the HTML or LWC component with the selected class
     */
    static queryByClass(cmp, classValue){
        return DOMUtils.querySelector(cmp, 'class', classValue);
    }

    /**
     * Method to query HTML Elements by data- fields.
     * @param {Object} cmp LWC Component to query HTML Elements
     * @param {String} dataField HTML attribute data-field. like data-name or data-id... (NOT write data-, only the name)
     * @param {String} value HTML attribute data-field value
     * 
     * @returns {Object | Array<Object>} Returns the HTML or LWC component with the selected data-field
     */
    static queryByDataFields(cmp, dataField, value){
        return DOMUtils.querySelector(cmp, 'data-' + dataField, value);
    }

    /**
     * Method to query HTML Elements by data-id
     * @param {Object} cmp LWC Component to query HTML Elements
     * @param {String} idValue HTML attribute data-id value
     * 
     * @returns {Object | Array<Object>} Returns the HTML or LWC component with the selected data-id
     */
    static queryByDataId(cmp, idValue){
        return DOMUtils.queryByDataFields(cmp, 'id', idValue);
    }

    /**
     * Method to query HTML Elements by data-name
     * @param {Object} cmp LWC Component to query HTML Elements
     * @param {String} nameValue HTML attribute data-name value
     * 
     * @returns {Object | Array<Object>} Returns the HTML or LWC component with the selected data-name
     */
    static queryByDataName(cmp, nameValue){
        return DOMUtils.queryByDataFields(cmp, 'name', nameValue);
    }

}