import { LightningElement, api, track } from 'lwc';
import CoreUtils from 'c/classCoreUtils';
import EventManager from 'c/classEventManager';
import SchemaUtils from 'c/classSchemaUtils';

export default class UiObjectFieldValueInput extends LightningElement {

    @api name = 'UiObjectFieldValueInput';
    @api
    get objectApiName() {
        return this._objectApiName;
    }
    set objectApiName(objectApiName) {
        this._objectApiName = objectApiName;
    }
    @api
    get objectData() {
        return this._objectData;
    }
    set objectData(objectData) {
        this._objectData = objectData;
        this._objectApiName = this._objectData?.apiName;
    }
    @api
    get fieldApiName() {
        return this._fieldApiName;
    }
    set fieldApiName(fieldApiName) {
        this._fieldApiName = fieldApiName;
    }
    @api
    get type() {
        return this._datatype;
    }
    set type(type) {
        this._datatype = type?.toLowerCase();
        this.checkDatatype();
    }
    @api
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    @api
    get options() {
        return this._options;
    }
    set options(options) {
        this._options = options;
    }
    @api
    get operator() {
        return this._operator;
    }
    set operator(operator) {
        this._operator = operator;
    }
    @api disabled;
    @api readonly;
    @api required;
    @api placeholder;
    @api label;
    @api messageWhenValueMissing;
    @track processedValue;
    @track _options;
    @track _value;
    @track _datatype;
    @track _objectData;
    @track isText;
    @track isTextArea;
    @track isDate;
    @track isDatetime;
    @track isTime;
    @track isEmail;
    @track isPhone;
    @track isUrl;
    @track isDouble;
    @track isCurrency;
    @track isPercent;
    @track isNumber;
    @track isCheckbox;
    @track isPicklist;
    @track isMultiPicklist;
    @track isLookup;
    @track islocation;
    @track isId;
    @track isEncryptedText;
    @track isDataCategoryReference;
    @track isAddress;
    @track isBase64;

    connectedCallback() {
        console.log(this.name + ' connectedCallback()');
        if (!this.objectData && this.objectApiName) {
            SchemaUtils.describeSObject(this.objectApiName).then((objData) => {
                this._objectData = objData;
                this._objectApiName = this._objectData?.apiName;
                if (this.fieldApiName) {
                    const field = this._objectData.fields[this.fieldApiName.toLowerCase()];
                    this.type = field.dataType.toLowerCase();
                    this.loadValues();
                }
            }).catch((error) => {
                console.log(error);
            });
        } else if (this._datatype) {
            this._objectApiName = this._objectData?.apiName;
            this.checkDatatype();
            this.loadValues();
        }
    }

    checkDatatype() {
        this.isText = this._datatype === 'string';
        this.isTextArea = this._datatype === 'textarea';
        this.isDate = this._datatype === 'date';
        this.isDatetime = this._datatype === 'datetime';
        this.isTime = this._datatype === 'time';
        this.isEmail = this._datatype === 'email';
        this.isPhone = this._datatype === 'phone';
        this.isUrl = this._datatype === 'url';
        this.isDouble = this._datatype === 'double';
        this.isCurrency = this._datatype === 'currency';
        this.isPercent = this._datatype === 'percent';
        this.isNumber = this._datatype === 'long' || this._datatype === 'integer';
        this.isCheckbox = this._datatype === 'boolean';
        this.isPicklist = this._datatype === 'picklist' || this._datatype === 'combobox';
        this.isMultiPicklist = this._datatype === 'multipicklist';
        this.isLookup = this._datatype === 'reference';
        this.islocation = this._datatype === 'location';
        this.isId = this._datatype === 'id';
        this.isEncryptedText = this._datatype === 'encryptedstring';
        this.isDataCategoryReference = this._datatype === 'datacategorygroupreference';
        this.isAddress = this._datatype === 'address';
        this.isBase64 = this._datatype === 'base64';
    }

    loadValues() {
        if (this.isPicklist || this.isMultiPicklist) {
            SchemaUtils.getPicklistValues(this._objectApiName, this._fieldApiName).then((values) => {
                if (values && values.length > 0) {
                    this._options = [];
                    if(this.isPicklist)
                        this._options.push({ label: '-- Ningun Valor Seleccionado --', value: undefined });
                    this._value = undefined;
                    for (const value of values) {
                        this._options.push({ label: value.label, value: value.value });
                        if (this.isPicklist && value.default)
                            this._value = value.value;
                    }
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    handleChange(event) {
        console.log(this.name + ' handleChange()');
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        const dataset = EventManager.getEventDataset(event);
        console.log(source);
        console.log(detail.value);
        switch (source) {
            case 'multipicklist':
                this.value = detail.value;
                this.processedValue = (detail.value) ? detail.value.join(',') : undefined;
                break;
            default:
                this.value = detail.value;
                this.processedValue = detail.value;
                break;
        }
        const eventBuilder = EventManager.eventBuilder('select');
        eventBuilder.addValue('value', this.processedValue);
        eventBuilder.addValue('rawValue', this.value);
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
    }

}