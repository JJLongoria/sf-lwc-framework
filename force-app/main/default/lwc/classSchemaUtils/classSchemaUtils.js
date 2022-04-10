import { LightningElement } from 'lwc';
import getSObjectInfo from '@salesforce/apex/SchemaUtils.describeSObjectLT';
import getSObjectTypeFromId from '@salesforce/apex/SchemaUtils.getSObjectTypeFromIdLT';
import getAllPicklistValues from '@salesforce/apex/SchemaUtils.getPicklistValuesDataLT';
import getDependantPicklistValuesMap from '@salesforce/apex/SchemaUtils.getDependentPicklistValuesMapLT';
import getKeyPrefix from '@salesforce/apex/SchemaUtils.getKeyPrefixLT';

/**
 * Class with methods to handle all about SObject Schema like describe SObjects, get picklist values, get object name from ids...
 */
export default class SchemaUtils extends LightningElement {

    /**
     * Method to get all Schema information from an SObject
     * 
     * @param {String} objectApiName SObject API Name to get Schema info
     * 
     * @returns {Promise<Object>} Return a promise with the SObject Data.
     */
    static describeSObject(objectApiName){
        return getSObjectInfo({objectApiName: objectApiName});
    }

    /**
     * Method to get all picklist values for a specific SObject Field.
     * @param {String} objectApiName SObject API Name
     * @param {String} fieldApiName SObject Field API Name
     * 
     * @returns {Promise<Array<Object>>} Return an array promise with the picklist values. { label: xxxxx, value: xxxxx, default: true | false, active: true | false }
     */
    static getPicklistValues(objectApiName, fieldApiName){
        return getAllPicklistValues({objectApiName: objectApiName, fieldApiName: fieldApiName});
    }

    /**
     * Method to get all dependant picklist values for a specific SObject Field.
     * @param {String} objectApiName SObject API Name
     * @param {String} fieldApiName SObject Field API Name
     * 
     * @returns {Promise<Array<Object>>} Return an array promise with the picklist values. { controlValue1: { valueApiName1: labelName1, valueApiName2: labelName2, ... }, controlValue2: { valueApiName1: labelName1, valueApiName2: labelName2, ... }, ... }
     */
    static getDependantPicklistValues(objectApiName, fieldApiName){
        return getDependantPicklistValuesMap({objectApiName: objectApiName, fieldAPIName: fieldApiName});
    }

    /**
     * Method to get the SObject API froma record Id.
     * @param {String} recordId Record Id to get the SObject API Name.
     * 
     * @returns {Promise<String>} Return a String promise with the SObject API Name
     */
    static getSObjectAPINameFromId(recordId){
        return getSObjectTypeFromId({recordId: recordId});
    }

    /**
     * Method to get the Key prefix (Id prefix) from an SObject
     * @param {String} objectApiName SObject API Name
     * 
     * @returns {Promise<String>} Return a String promise with the key prefix
     * 
     */
    static getKeyPrefix(objectApiName){
        return getKeyPrefix({objectApiName: objectApiName});
    }
}