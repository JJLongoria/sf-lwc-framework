import { createRecord, updateRecord, deleteRecord } from 'lightning/uiRecordApi';
import queryData from '@salesforce/apex/SOQLFactory.query';
import cachedQueryData from '@salesforce/apex/SOQLFactory.cachedQuery';
import createRecords from '@salesforce/apex/DMLUtils.createRecords';
import updateRecords from '@salesforce/apex/DMLUtils.updateRecords';
import upsertRecords from '@salesforce/apex/DMLUtils.upsertRecords';
import deleteRecords from '@salesforce/apex/DMLUtils.deleteRecords';
import CoreUtils from 'c/classCoreUtils';

/**
 * Class to handle database and all about it like create and execute queries or make CRUD Operations with one or many records.
 */
export default class Database {

    /**
     * Method to create a Query Builder. You can create it directly using all method params or can create 
     * it using the inner builder methods (recommended because implement the builder pattern and make ir more useful and easy to read) like:
     * 
     *      - addField(fieldName): Add projection field to the existing fields
     * 
     *      - setFields(fields): Set projection fields
     * 
     *      - setWhereConditions(whereConditions): Set where conditions array to the where clause
     * 
     *      - addWhereCondition(field, operator, value): Add where condition to the existing where conditions
     * 
     *      - setCustomLogic(customLogic): Create a custom logic to where conditions like: 1 AND 2 AND (3 OR 4 OR 5)
     * 
     *      - createGroupBy(fields, havingCoditions, customLogic): Create a Group by clause
     * 
     *      - addGroupByField(fieldName): Add Group By field to the existing Group By fields
     * 
     *      - addGroupByCondition(field, operator, value): Add Group By condition to the existing Group By conditions.
     * 
     *      - setGroupByLogic(logic): Create a custom logic to Group By conditions like: 1 AND 2 AND (3 OR 4 OR 5)
     * 
     *      - createOrderBy(fields, order): Create Order By clause
     * 
     *      - addOrderByField(fieldName): Add field to the existing Order By fields
     * 
     *      - setOrderByOrder(order): Set Order By order: ASC or DESC.
     * 
     *      - setLimit(queryLimit): Set query limit
     * 
     *      - build(): Method to build the query object with all query data.
     * 
     * Like a builder pattern, you can call methods on a sequence to create a query builder directly, for example:
     * let queryBuilder = Database.queryBuilder('Account');
     * queryBuilder.setFields(['Id, Name']).addField('RecordTypeId').addField('otherField')... and the same with all query builder methods except build()
     * 
     * @param {String} objApiName SObject API Name (Required)
     * @param {Array<String>} [fields] Query projection fields (Optional)
     * @param {Array<Object>} [whereConditions] Query where clause conditions (Optional). Where condition: { field: '', operator: '', value: '' }
     * @param {String} [customLogic] Where conditions custom logic like: 1 AND 2 AND (3 OR 4 OR 5) (Optional)
     * @param {Object} [groupBy] Query Group By clause (Optional). Group By: { fields: [], havingCoditions: [], customLogic: '' }. Having condition objects are like where conditions object
     * @param {Object} [orderBy] Query Order By clause (Optional). Order By: {fields: [], order: 'ASC | DESC' }
     * @param {Number} [queryLimit] Query limit clause (Optional).
     * 
     * @returns Returns a query builder object to execute any query from LWC components.
     */
    static queryBuilder(objApiName, fields, whereConditions, customLogic, groupBy, orderBy, queryLimit) {
        return {
            objectApiName: objApiName,
            fields: fields,
            whereConditions: whereConditions,
            customLogic: customLogic,
            groupBy: groupBy,
            orderBy: orderBy,
            queryLimit: queryLimit,
            build: function () {
                return {
                    objectApiName: this.objectApiName,
                    fields: this.fields,
                    whereConditions: this.whereConditions,
                    customLogic: this.customLogic,
                    groupBy: this.groupBy,
                    orderBy: this.orderBy,
                    queryLimit: this.queryLimit,
                }
            },
            addField: function (fieldName) {
                if (!this.fields)
                    this.fields = [];
                if (!this.fields.includes(fieldName))
                    this.fields.push(fieldName);
                return this;
            },
            setFields: function (fields) {
                this.fields = fields;
                return this;
            },
            setWhereConditions: function (whereConditions) {
                this.whereConditions = whereConditions;
                return this;
            },
            addWhereCondition: function (field, operator, value) {
                if (!this.whereConditions)
                    this.whereConditions = [];
                this.whereConditions.push({
                    field: field,
                    operator: operator,
                    value: value
                });
                return this;
            },
            setCustomLogic: function (customLogic) {
                this.customLogic = customLogic;
                return this;
            },
            createGroupBy: function (fields, havingCoditions, customLogic) {
                if (!this.groupBy)
                    this.groupBy = {
                        fields: fields,
                        havingCoditions: havingCoditions,
                        customLogic: customLogic
                    }
                return this;
            },
            addGroupByField: function (fieldName) {
                if (!this.groupBy)
                    this.groupBy = {
                        fields: [],
                        havingCoditions: undefined,
                        customLogic: undefined
                    }
                if (!this.groupBy.fields)
                    this.groupBy.fields = [];
                if (!this.groupBy.fields.includes(fieldName))
                    this.groupBy.fields.push(fieldName);
                return this;
            },
            addGroupByCondition: function (field, operator, value) {
                if (!this.groupBy)
                    this.groupBy = {
                        fields: undefined,
                        havingCoditions: [],
                        customLogic: undefined
                    }
                if (!this.groupBy.havingCoditions)
                    this.groupBy.havingCoditions = [];
                this.groupBy.havingCoditions.push({
                    field: field,
                    operator: operator,
                    value: value
                });
                return this;
            },
            setGroupByLogic: function (logic) {
                if (!this.groupBy)
                    this.groupBy = {
                        fields: undefined,
                        havingCoditions: [],
                        customLogic: logic
                    }
                this.groupBy.customLogic = logic;
            },
            createOrderBy: function (fields, order) {
                if (!this.orderBy)
                    this.orderBy = {
                        fields: fields,
                        order: order,
                    }
                return this;
            },
            addOrderByField: function (fieldName) {
                if (!this.orderBy)
                    this.orderBy = {
                        fields: [],
                        order: undefined,
                    }
                if (!this.orderBy.fields)
                    this.orderBy.fields = [];
                if (!this.orderBy.fields.includes(fieldName))
                    this.orderBy.fields.push(fieldName);
                return this;
            },
            setOrderByOrder: function (order) {
                if (!this.orderBy)
                    this.orderBy = {
                        fields: undefined,
                        order: order,
                    }
                this.orderBy.order = order;
                return this;
            },
            setLimit: function (queryLimit) {
                this.queryLimit = queryLimit;
                return this;
            }
        };
    }

    /**
     * Method to create the SObject json object to use it on DML methods or work with LWC components
     * @param {String} apiName SObject API Name
     * @param {Object} fields SObject Fields. { 'fieldAPIName1': value, 'fieldAPIName2': value, ... }
     * 
     * @returns {Object} Return the SObject json object: { apiName: 'name', fields: {...} }
     */
    static createSObject(apiName, fields) {
        return {
            apiName: apiName,
            fields: fields || {}
        }
    }

    /**
     * Method to execute queries using query builder.
     * @param {Object} queryBuilder Querybuilder with the query data
     * @param {Boolean} [cacheable] true to execute cached queries, false in otherwise
     * 
     * @returns {Promise<Array<Object>>}
     */
    static query(queryBuilder, cacheable) {
        if (cacheable)
            return cachedQueryData(queryBuilder.build());
        return queryData(queryBuilder.build());
    }

    /**
     * Method to insert records
     * @param {Object | Array<Object>} records SObject records to insert, must be a json SObject { apiName: 'objectApiName', fields: {...} }
     * 
     * @returns {Promise<Array<Object>>} Return an array with the inserted records.
     */
    static insert(records) {
        return createRecords({ records: CoreUtils.forceArray(records) });
    }

    /**
     * Method to update records
     * @param {Object | Array<Object>} records SObject records to update, must be a json SObject { apiName: 'objectApiName', fields: {...} }
     * 
     * @returns {Promise<Array<Object>>} Return an array with the updated records.
     */
    static update(records) {
        return updateRecords({ records: CoreUtils.forceArray(records) });
    }

    /**
     * Method to upsert records
     * @param {Object | Array<Object>} records SObject records to upsert, must be a json SObject { apiName: 'objectApiName', fields: {...} }
     * 
     * @returns {Promise<Array<Object>>} Return an array with the upserted records.
     */
    static upsert(records) {
        return upsertRecords({ records: CoreUtils.forceArray(records) });
    }

    /**
     * Method to delete records
     * @param {Object | Array<Object>} records SObject records to delete, must be a json SObject { apiName: 'objectApiName', fields: {...} }
     * 
     * @returns {Promise<Array<Object>>} Return an array with the deleted records.
     */
    static delete(records) {
        return deleteRecords({ records: CoreUtils.forceArray(records) });
    }

    /**
     * Method to create single record with LWC Salesforce methods
     * @param {Object} record JSON SObject to insert. { apiName: 'objectApiName', fields: {...} }
     * 
     * @returns {Object} Return the created record
     */
    static insertSF(record) {
        return createRecord(record);
    }

    /**
     * Method to update single record with LWC Salesforce methods
     * @param {Object} recordOrFields JSON SObject to update. { apiName: 'objectApiName', fields: {...} }, or object fields.
     * 
     * @returns {Object} Return the update record
     */
    static updateSF(recordOrFields) {
        return updateRecord(recordOrFields.fields ? recordOrFields.fields : recordOrFields);
    }

    /**
     * Method to create delete record with LWC Salesforce methods
     * @param {String | Object} recordOrId JSON SObject to delete. { apiName: 'objectApiName', fields: {...} } or the record id to delete
     * 
     * @returns {Object} Return the delete record
     */
    static deleteSF(recordOrId) {
        return deleteRecord(typeof recordOrId === 'string' ? recordOrId : recordOrId.field.Id);
    }
}