import { LightningElement, api, track } from 'lwc';

export default class UiSpinner extends LightningElement {
    @api
    get title() {
        return this._title;
    };
    set title(title) {
        this._title = title;
    };
    @api
    get message() {
        return this._message;
    };
    set message(message) {
        this._message = message;
    };
    @api
    get variant() {
        return this._variant;
    };
    set variant(variant) {
        this._variant = variant;
        if (size === 'brand')
            this._size = 'slds-spinner_brand';
        else if (size === 'inverse')
            this._size = 'slds-spinner_inverse';
        else
            this._variant = 'slds-spinner_brand';
        this.style = 'slds-spinner ' + this._size + ' ' + this._variant;
    }
    @api
    get size() {
        return this._size;
    };
    set size(size) {
        this._size = size;
        if (size === 'xx-small')
            this._size = 'slds-spinner_xx-small';
        else if (size === 'x-small')
            this._size = 'slds-spinner_x-small';
        else if (size === 'small')
            this._size = 'slds-spinner_small';
        else if (size === 'medium')
            this._size = 'slds-spinner_medium';
        else if (size === 'large')
            this._size = 'slds-spinner_large';
        else
            this._size = 'slds-spinner_medium';
        this.style = 'slds-spinner ' + this._size + ' ' + this._variant;
    }

    _size = 'slds-spinner_medium';
    _variant = 'slds-spinner_brand';
    @track style = 'slds-spinner slds-spinner_medium slds-spinner_brand';
    @track _message;
    @track _title;

}