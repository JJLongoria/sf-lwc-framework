import { LightningElement, api, track, wire } from 'lwc';
import EventManager from 'c/classEventManager';

export default class UiSearchInput extends LightningElement {

    @api iconName;
    @api label;
    @api required = false;
    @api messageWhenValueMissing;
    @api placeholder = 'Search...';
    @api limit;
    @api readOnly = false;
    @api clearOnSelect = false;
    @api allowSelectAll = false;
    @api searchTerm = undefined;
    @api values = [];
    @api valuesText = 'Values';
    @api name = 'UiSearchInput';

    @track _value = undefined;
    @track selectedName;
    @track isValueSelected;
    @track blurTimeout;
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';
    @track valuesToShow = [];
    @track noValues = false;

    pillRemoved;
    elementClicked = false;
    onload = true;

    @api
    get value() {
        return this._value;
    }
    set value(value) {
        this.setAttribute('value', value);
        this._value = value;
        if (!value) {
            this.selectedName = undefined;
            this.isValueSelected = false;
        } else {
            this.getSelectedValue();
        }
    }

    renderedCallback() {
        if (!this.elementClicked) {
            if (this.pillRemoved) {
                this.checkRequired();
                this.pillRemoved = false;
            }
        }
        this.onload = false;
        this.elementClicked = false;
    }

    handleClick() {
        console.log('handleClick');
        this.elementClicked = true;
        this.searchTerm = undefined;
        this.getValuesToShow();
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    getValuesToShow() {
        this.valuesToShow = [];
        if (this.values) {
            for (const val of this.values) {
                if (this.limit && this.valuesToShow.length === this.limit)
                    break;
                if (this.searchTerm) {
                    if (val.label && val.label.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1)
                        this.valuesToShow.push(val);
                } else {
                    this.valuesToShow.push(val);
                }
            }
        }
        this.noValues = this.valuesToShow.length == 0;
    }

    getSelectedValue() {
        let value = {};
        for (let val of this.values) {
            if (val.value === this._value) {
                value = val;
                break;
            }
        }
        this.selectedName = value.label;
        this.isValueSelected = true;
        this.checkRequired();
        const eventBuilder = EventManager.eventBuilder('select');
        eventBuilder.addValue('value', value.value);
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    onBlur() {
        console.log('onBlur');
        this.blurTimeout = setTimeout(() => { this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus' }, 300);
        this.checkRequired();
    }

    onSelect(event) {
        console.log('onSelect');
        this._value = event.currentTarget.dataset.id;
        this.selectedName = event.currentTarget.dataset.name;
        let value = {};
        for (let val of this.values) {
            if (val.value === this._value) {
                value = val;
                break;
            }
        }
        this.selectedName = value.label;
        this.isValueSelected = true;
        this.checkRequired();
        const eventBuilder = EventManager.eventBuilder('select');
        eventBuilder.addValue('value', value.value);
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        if (this.clearOnSelect) {
            this.searchTerm = undefined;
            this.valuesToShow = [];
            this._value = undefined;
            this.isValueSelected = false;
        }
    }

    handleRemovePill() {
        console.log('handleRemovePill');
        this.searchTerm = undefined;
        this.isValueSelected = false;
        this._value = undefined;
        const eventBuilder = EventManager.eventBuilder('remove');
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
        this.pillRemoved = true;
    }

    checkRequired() {
        if (this.required) {
            console.log('checkRequired');
            const input = this.template.querySelector('[data-id="input"]');
            if (!this.isValueSelected && !this.searchTerm)
                input.setCustomValidity(this.messageWhenValueMissing);
            else
                input.setCustomValidity('');
            input.reportValidity();
        }
    }

    onChange(event) {
        console.log('onChange');
        this.searchTerm = event.target.value;
        if (this.searchTerm && this.searchTerm.length > 0) {
            this.getValuesToShow();
        }
        this.checkRequired();
    }

    onSelectAll() {
        console.log('onSelectAll');
        const values = [];
        for(const value of this.valuesToShow){
            values.push(value.value);
        }
        const eventBuilder = EventManager.eventBuilder('selectall');
        eventBuilder.addValue('values', values);
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
    }

    handleClickPill(event){
        const eventBuilder = EventManager.eventBuilder('clickpill');
        eventBuilder.addValue('value', this._value);
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
    }

}