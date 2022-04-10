import { LightningElement, api, track, wire } from 'lwc';
import EventManager from 'c/classEventManager';
import CoreUtils from 'c/classCoreUtils';
import SchemaUtils from 'c/classSchemaUtils';
import DOMUtils from 'c/classDOMUtils';

const ICONS_BY_DATATYPE = {
    'address': 'utility:location',
    'base64': 'utility:swarm_session',
    'boolean': 'utility:toggle',
    'combobox': 'utility:picklist',
    'currency': 'utility:currency',
    'datacategorygroupreference': 'utility:matrix',
    'date': 'utility:date_input',
    'datetime': 'utility:date_time',
    'double': 'utility:number_input',
    'email': 'utility:email',
    'encryptedstring': 'utility:text',
    'id': 'utility:key',
    'integer': 'utility:number_input',
    'location': 'utility:world',
    'long': 'utility:number_input',
    'multipicklist': 'utility:multi_picklist',
    'percent': 'utility:percent',
    'phone': 'utility:phone_portrait',
    'picklist': 'utility:picklist_type',
    'reference': 'utility:database',
    'string': 'utility:text',
    'textarea': 'utility:textarea',
    'time': 'utility:clock',
    'url': 'utility:text',
}

export default class UiSearchInputTree extends LightningElement {

    @api name = 'UiSearchInputTree';
    @api objectApiName = 'Account';
    @api label;
    @api required = false;
    @api messageWhenValueMissing;
    @api placeholder = 'Search field...';
    @api searchTerm;
    @api readOnly = false;
    @api objectData;
    @api showApiNames = false;
    @api
    get showIcons() {
        return this._showIcons;
    }
    set showIcons(showIcons) {
        this._showIcons = showIcons;
    }
    @api
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = CoreUtils.clone(value);
    }

    @track _value = undefined;
    @track blurTimeout;
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';
    @track valuesToShow;
    @track breadcrumbs = [];
    @track backButtonDisabled = true;
    @track actualObject;
    @track selectedValue;
    @track selectedField;
    @track selectedFieldsDeep = [];
    @track loading = false;
    @track loadingTitle = 'Cargando';

    loadedObjects = {};
    values = [];
    pillRemoved;
    elementClicked = false;
    onload = true;
    _showIcons = true;

    connectedCallback() {
        console.log(this.name + ' connectedCallback()');
        if (!this.objectData) {
            SchemaUtils.describeSObject(this.objectApiName).then((objData) => {
                this.objectData = objData;
                this.actualObject = this.objectData;
                this.transformFieldsToValues();
                this.loadedObjects[this.objectData.apiName] = this.objectData;
            }).catch((error) => {
                this.loading = false;
                console.log(error);
            });
        } else {
            this.actualObject = this.objectData;
            this.breadcrumbs.push({
                value: this.objectApiName,
                label: this.objectData.label,
            });
            this.transformFieldsToValues();
            this.loadedObjects[this.objectData.apiName] = this.objectData;
        }
    }

    renderedCallback() {
        console.log(this.name + ' renderedCallback()');
        if (!this.elementClicked) {
            if (this.pillRemoved) {
                this.checkRequired();
                this.pillRemoved = false;
            }
        }
        this.onload = false;
        this.elementClicked = false;
    }

    handleClick(event) {
        console.log(this.name + ' handleClick()');
        const source = EventManager.getSource(event);
        const dataset = EventManager.getEventDataset(event);
        const input = DOMUtils.queryByDataName(this, 'input');
        if (source === 'input') {
            this.elementClicked = true;
            this.searchTerm = undefined;
            this.filterValues();
            this.inputClass = 'slds-has-focus';
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
        } else if (source === 'cancel') {
            this.selectedField = undefined;
            this.backButtonDisabled = this.breadcrumbs.length <= 1;
            if (this.blurTimeout) {
                input.focus();
                clearTimeout(this.blurTimeout);
            }
        } else if (source === 'back') {
            if (!this.selectedField) {
                this.breadcrumbs.pop();
                this.selectedFieldsDeep.pop();
                if (this.selectedFieldsDeep.length > 0)
                    this.actualObject = this.loadedObjects[this.selectedFieldsDeep[this.selectedFieldsDeep.length - 1].obj];
                else
                    this.actualObject = this.loadedObjects[this.objectApiName];
                this.transformFieldsToValues();
                this.backButtonDisabled = this.breadcrumbs.length <= 1;
            }
            if (this.blurTimeout) {
                input.focus();
                clearTimeout(this.blurTimeout);
            }
        } else if (source == 'select') {
            this.selectedFieldsDeep.push({
                obj: this.actualObject,
                fromField: (this.selectedFieldsDeep.length > 0) ? this.selectedFieldsDeep[this.selectedFieldsDeep.length - 1].fieldToLower : undefined,
                field: this.selectedField.apiName,
                fieldToLower: this.selectedField.apiName.toLowerCase(),
                relatedTo: this.selectedValue.relatedTo,
                value: this.selectedValue.value,
                datatype: this.selectedField.dataType.toLowerCase(),
                label: this.selectedField.label,
                iconName: this.selectedValue.iconName
            });
            let index = 0;
            for (const selectedFieldData of this.selectedFieldsDeep) {
                if (index == 0) {
                    this._value = { value: selectedFieldData.value, label: selectedFieldData.label }
                } else {
                    this._value.value += '.' + selectedFieldData.value;
                    this._value.label += ' > ' + selectedFieldData.label;
                }
                this._value.iconName = selectedFieldData.iconName
                index++;
            }
            this.checkRequired();
            const eventBuilder = EventManager.eventBuilder('select');
            eventBuilder.addValue('value', this.selectedFieldsDeep[this.selectedFieldsDeep.length - 1]);
            eventBuilder.setSource(this.name);
            EventManager.fire(this, eventBuilder.build());
            if (this.blurTimeout) {
                clearTimeout(this.blurTimeout);
            }
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        } else if (source === 'bread') {
            if (this.blurTimeout) {
                input.focus();
                clearTimeout(this.blurTimeout);
            }
            if (!this.selectedField) {
                if (dataset.index === 0) {
                    this.breadcrumbs.length = 1;
                    this.selectedFieldsDeep = [];
                } else {
                    for (let i = this.breadcrumbs.length - 1; i > dataset.index; i--) {
                        this.breadcrumbs.splice(i, 1);
                    }
                    this.selectedFieldsDeep.length = this.breadcrumbs.length - 1;
                }
                if (this.selectedFieldsDeep.length > 0)
                    this.actualObject = this.loadedObjects[this.selectedFieldsDeep[this.selectedFieldsDeep.length - 1].obj];
                else
                    this.actualObject = this.loadedObjects[this.objectApiName];
                this.transformFieldsToValues();
                this.backButtonDisabled = this.breadcrumbs.length <= 1;
            }
        }
    }

    transformFieldsToValues() {
        if (this.actualObject && CoreUtils.hasKeys(this.actualObject.fields)) {
            this.values = [];
            for (const fieldKey of Object.keys(this.actualObject.fields)) {
                const field = this.actualObject.fields[fieldKey];
                const val = this.transformFieldToValue(fieldKey, field);
                if (field.referenceToInfos && field.referenceToInfos.length === 1)
                    val.relatedTo = field.referenceToInfos[0].apiName;
                this.values.push(val);
                if (field.referenceToInfos && field.referenceToInfos.length > 0) {
                    const valTmp = this.transformFieldToValue(fieldKey, field);
                    if (field.label.toLowerCase().endsWith('id')) {
                        valTmp.label = valTmp.label.substring(0, valTmp.label.length - 2).trim();
                    }
                    valTmp.label += '  >'
                    valTmp.related = true;
                    if (field.apiName.endsWith('Id')) {
                        valTmp.value = field.apiName.substring(0, field.apiName.length - 2);
                        valTmp.labelApi = valTmp.value + '  >'
                        this.values.push(valTmp);
                    } else if (field.apiName.endsWith('__c')) {
                        valTmp.value = field.apiName.substring(0, field.apiName.length - 1) + 'r';
                        valTmp.labelApi = valTmp.value + '  >'
                        this.values.push(valTmp);
                    }
                }
            }
        }
        if (this.values.length == 0)
            this.valuesToShow = undefined;
        else if (this.searchTerm)
            this.filterValues();
    }

    filterValues() {
        this.valuesToShow = [];
        for (const value of this.values) {
            if (this.searchTerm) {
                if (value.label && value.label.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1)
                    this.valuesToShow.push(value);
                else if (value.value && value.value.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1)
                    this.valuesToShow.push(value);
            } else {
                this.valuesToShow.push(value);
            }
        }
    }

    transformFieldToValue(fieldKey, field) {
        return {
            key: fieldKey,
            label: field.label,
            labelApi: field.apiName,
            value: field.apiName,
            datatype: field.dataType,
            iconName: ICONS_BY_DATATYPE[field.dataType.toLowerCase()],
            related: false,
            relatedTo: undefined
        }
    }

    getSelectedValue() {
        if (!this._value)
            return;
        let value = {};
        for (let val of this.valuesToShow) {
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
        console.log(this.name + ' onBlur()');
        this.blurTimeout = setTimeout(() => {
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
            this.breadcrumbs.length = 1;
            this.selectedFieldsDeep = [];
            this.selectedField = undefined;
            this.selectedValue = undefined;
            this.actualObject = this.loadedObjects[this.objectApiName];
            this.transformFieldsToValues();
            this.checkRequired();
        }, 300);
    }

    onSelect(event) {
        console.log(this.name + ' onSelect()');
        const source = EventManager.getSource(event);
        const dataset = EventManager.getEventDataset(event);
        const input = DOMUtils.queryByDataName(this, 'input');
        this.selectedValue = this.valuesToShow[dataset.index];
        const field = this.selectedField = this.actualObject.fields[this.selectedValue.key];
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        if (this.selectedValue.related) {
            this.searchTerm = undefined;
            if (field.referenceToInfos && field.referenceToInfos.length === 1) {
                this.loading = true;
                const relObjName = field.referenceToInfos[0].apiName;
                if (!this.loadedObjects[relObjName]) {
                    this.loadingTitle = 'Cargando datos de ' + relObjName;
                    SchemaUtils.describeSObject(relObjName).then((objData) => {
                        this.actualObject = objData;
                        this.transformFieldsToValues();
                        this.loadedObjects[this.actualObject.apiName] = this.actualObject;
                        this.loading = false;
                        this.breadcrumbs.push({
                            value: this.actualObject.apiName,
                            label: this.actualObject.label,
                        });
                        this.selectedFieldsDeep.push({
                            obj: this.actualObject.apiName,
                            fromField: (this.selectedFieldsDeep.length > 0) ? this.selectedFieldsDeep[this.selectedFieldsDeep.length - 1].fieldToLower : undefined,
                            field: field.apiName,
                            fieldToLower: field.apiName.toLowerCase(),
                            relatedTo: this.selectedValue.relatedTo,
                            value: this.selectedValue.value,
                            datatype: field.dataType.toLowerCase(),
                            label: field.label,
                            iconName: this.selectedValue.iconName
                        });
                        this.backButtonDisabled = this.breadcrumbs.length <= 1;
                        input.focus();
                    }).catch((error) => {
                        this.loading = false;
                        console.log(error);
                    });
                } else {
                    const box = DOMUtils.queryByDataId(this, 'elementList');
                    this.actualObject = this.loadedObjects[relObjName];
                    this.transformFieldsToValues();
                    this.breadcrumbs.push({
                        value: this.actualObject.apiName,
                        label: this.actualObject.label,
                    });
                    this.selectedFieldsDeep.push({
                        obj: this.actualObject.apiName,
                        fromField: (this.selectedFieldsDeep.length > 0) ? this.selectedFieldsDeep[this.selectedFieldsDeep.length - 1].fieldToLower : undefined,
                        field: field.apiName,
                        fieldToLower: field.apiName.toLowerCase(),
                        relatedTo: this.selectedValue.relatedTo,
                        value: this.selectedValue.value,
                        datatype: field.dataType.toLowerCase(),
                        label: field.label,
                        iconName: this.selectedValue.iconName
                    });
                    this.backButtonDisabled = this.breadcrumbs.length <= 1;
                    this.loading = false;
                    box.scrollTop = 0;
                    input.focus();
                }
                this.selectedField = undefined;
            } else {
                this.backButtonDisabled = true;
                this.selectedField = field;
            }
        } else {
            this.selectedField = field;
        }
    }

    handleRemovePill() {
        console.log(this.name + ' handleRemovePill()');
        this.searchTerm = undefined;
        this._value = undefined;
        this.breadcrumbs.length = 1;
        this.selectedField = undefined;
        this.selectedValue = undefined;
        this.selectedFieldsDeep = [];
        this.actualObject = this.loadedObjects[this.objectApiName];
        this.transformFieldsToValues();
        const eventBuilder = EventManager.eventBuilder('remove');
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
        this.pillRemoved = true;
    }

    checkRequired() {
        if (this.required) {
            console.log('checkRequired');
            const input = DOMUtils.queryByDataName(this, 'input');
            if (!this._value && !this.searchTerm)
                input.setCustomValidity(this.messageWhenValueMissing);
            else
                input.setCustomValidity('');
            input.reportValidity();
        }
    }

    onChange(event) {
        console.log(this.name + ' onChange()');
        this.searchTerm = event.target.value;
        if (this.searchTerm && this.searchTerm.length > 0) {
            this.filterValues();
        }
        this.checkRequired();
    }

    onSelectAll() {
        console.log(this.name + ' onSelectAll()');
        const values = [];
        for (const value of this.valuesToShow) {
            values.push(value.value);
        }
        const eventBuilder = EventManager.eventBuilder('selectall');
        eventBuilder.addValue('values', values);
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
    }

}