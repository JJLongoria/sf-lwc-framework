import { LightningElement, api, track } from 'lwc';

const OPERATORS_BY_DATATYPE = {
    'address': TEXT_TYPE,
    'base64': TEXT_TYPE,
    'boolean': BOOLEAN_TYPE,
    'combobox': TEXT_TYPE,
    'currency': NUMBER_TYPE,
    'datacategorygroupreference': TEXT_TYPE,
    'date': DATE_TYPE,
    'datetime': DATE_TYPE,
    'double': NUMBER_TYPE,
    'email': TEXT_TYPE,
    'encryptedstring': TEXT_TYPE,
    'id': TEXT_TYPE,
    'integer': NUMBER_TYPE,
    'location': NUMBER_TYPE,
    'long': NUMBER_TYPE,
    'multipicklist': TEXT_TYPE,
    'percent': NUMBER_TYPE,
    'phone': TEXT_TYPE,
    'picklist': TEXT_TYPE,
    'reference': ID_TYPE,
    'string': TEXT_TYPE,
    'textarea': TEXT_TYPE,
    'time': DATE_TYPE,
    'url': TEXT_TYPE,
}

export default class UiObjectFieldValueInput extends LightningElement {

    @api name = 'UiObjectFieldValueInput';
    @api
    get objectData(){
        return this._objectData;
    }
    set objectData(objectData){
        this._objectData = objectData;
    }
    @api
    get type(){
        return this._datatype;
    }
    set type(type){
        this._datatype = type;
        this.isText = this._datatype === 'text';
        this.isTextArea = this._datatype === 'textarea';
        this.isDate = this._datatype === 'date' || this._datatype === 'datetime';
        this.isTime = this._datatype === 'time';
        this.isEmail = this._datatype === 'email';
        this.isPhone = this._datatype === 'phone';
        this.isUrl = this._datatype === 'url';
        this.isDouble = this._datatype === 'double';
        this.isCurrency = this._datatype === 'currency';
        this.isPercent = this._datatype === 'percent';
        this.isNumber = this._datatype === 'long' || this._datatype === 'integer';
        this.isCheckbox = this._datatype === 'boolean';
    }
    @api
    get value(){
        return this._value;
    }
    set value(value){
        this._value = value;
    }
    @api disabled;
    @api readonly;
    @api required;
    @api placeholder;
    @api label;
    @api messageWhenValueMissing;
    @track _value;
    @track _datatype;
    @track _objectData;
    @track isText;
    @track isTextArea;
    @track isDate;
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

}