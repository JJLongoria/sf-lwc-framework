import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import Database from 'c/classDatabase';
import NavigationService from 'c/classNavigationService';
import EventManager from 'c/classEventManager';

export default class UiLookupInput extends NavigationMixin(LightningElement) {
    @api objectApiName;
    @api name = 'UiLookupInput';
    @api iconName;
    @api whereConditions;
    @api customLogic;
    @api fields;
    @api label;
    @api required = false;
    @api fieldName = 'Name';
    @api messageWhenValueMissing;
    @api searchTerm = undefined;
    @api placeholder = 'Search...';
    @api limit = 10;
    @api readOnly = false;
    @api clearOnSelect = false;

    @track _recordId;
    @track selectedName;
    @track _records;
    @track originalRecords;
    @track isValueSelected;
    @track blurTimeout;

    @api
    get records() {
        return this._records;
    }
    set records(value) {
        let result;
        if (value) {
            result = [];
            for (const val of value) {
                result.push({
                    Id: val.Id,
                    Name: val[this.fieldName]
                });
            }
        }
        this.setAttribute('records', result);
        this._records = result;
    }

    @api
    get recordId() {
        return this._recordId;
    }
    set recordId(value) {
        this.setAttribute('recordId', value);
        this._recordId = value;
        if (!value) {
            this.selectedName = undefined;
            this.isValueSelected = false;
        } else {
            this.getRecord();
        }
    }

    recordsResultLabel = 'No se han encontrado registros';
    searchTerm;
    href;
    pillRemoved;
    elementClicked = false;
    onload = true;
    // css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';

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
        this.records = undefined;
        this._recordId = undefined;
        this.getRecentlyViewedRecords();
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        console.log('onBlur');
        this.blurTimeout = setTimeout(() => { this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus' }, 300);
        this.checkRequired();
    }

    onSelect(event) {
        console.log('onSelect');
        this._recordId = event.currentTarget.dataset.id;
        this.selectedName = event.currentTarget.dataset.name;
        let recordResult = {};
        for (let record of this.originalRecords) {
            if (record.Id === this._recordId) {
                recordResult = record;
                break;
            }
        }
        this.href = '/' + recordResult.Id;
        this.isValueSelected = true;
        this.checkRequired();
        const eventBuilder = EventManager.eventBuilder('select');
        eventBuilder.addValue('record', recordResult);
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        if (this.clearOnSelect) {
            this.searchTerm = undefined;
            this.records = undefined;
            this.recordId = undefined;
            this.isValueSelected = false;
        }
    }

    handleRemovePill() {
        console.log('handleRemovePill');
        this.searchTerm = undefined;
        this.isValueSelected = false;
        this._recordId = undefined;
        const eventBuilder = EventManager.eventBuilder('remove');
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
        this.pillRemoved = true;
    }

    handleClickPill(event) {
        event.stopPropagation();
        console.log('handleClickPill');
        if (this._recordId) {
            NavigationService.goToRecordPage(this, this._recordId, true);
        }
    }

    onChange(event) {
        console.log('onChange');
        this.searchTerm = event.target.value;
        if (this.searchTerm && this.searchTerm.length >= 3) {
            const queryBuilder = Database.queryBuilder(this.objectApiName, this.fields);
            queryBuilder.setWhereConditions(this.whereConditions).setCustomLogic(this.customLogic).setLimit(this.limit);
            Database.query(queryBuilder).then((records) => {
                this.error = undefined;
                this.records = records;
                this.originalRecords = records;
                if (this.records.length > 0)
                    this.recordsResultLabel = 'Registros Encontrados';
                else
                    this.recordsResultLabel = 'No se han encontrado registros';
            }).catch((error) => {
                console.log(error);
                this.error = error;
                this.records = undefined;
                this.recordsResultLabel = 'No se han encontrado registros';
            });
        }
        this.checkRequired();
    }

    processWhere(whereConditions) {
        console.log('processWhere');
        const resultWhere = [];
        for (const where of whereConditions) {
            const newWhere = {
                field: where.field,
                operator: where.operator,
                value: where.value
            }
            if (newWhere.value !== undefined && newWhere.value.indexOf('{search}') != -1)
                newWhere.value = newWhere.value.split('{search}').join(this.searchTerm);
            resultWhere.push(newWhere);
        }
        console.log(resultWhere);
        return resultWhere;
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

    getRecentlyViewedRecords() {
        console.log('getRecentlyViewedRecords');
        const resultWhere = [
            {
                field: 'LastViewedDate',
                operator: '!=',
                value: null
            }
        ];
        for (const where of this.whereConditions) {
            const newWhere = {
                field: where.field,
                operator: where.operator,
                value: where.value
            }
            if (newWhere.value !== undefined && newWhere.value.indexOf('{search}') === -1)
                resultWhere.push(newWhere);
        }
        const params = {
            objectApiName: this.objectApiName,
            fields: this.fields,
            whereConditions: resultWhere,
            customLogic: undefined,
            groupBy: null,
            orderBy: {
                fields: ['LastViewedDate'],
                order: 'DESC'
            },
            queryLimit: 10,
        };
        const queryBuilder = Database.queryBuilder(this.objectApiName, this.fields);
        queryBuilder.setWhereConditions(resultWhere).createOrderBy(['LastViewedDate'], 'DESC');
        queryBuilder.setLimit(10);
        Database.query(queryBuilder).then((records) => {
            console.log(records);
            this.error = undefined;
            this.records = records;
            this.originalRecords = records;
            if (this.records.length > 0)
                this.recordsResultLabel = 'Registros Vistos Recientemente';
            else
                this.recordsResultLabel = 'No se han encontrado registros';
        }).catch((error) => {
            this.error = error;
            this.records = undefined;
            this.recordsResultLabel = 'No se han encontrado registros';
        });
    }

    getRecord() {
        console.log('getRecord');
        const queryBuilder = Database.queryBuilder(this.objectApiName, this.fields);
        queryBuilder.addWherecondition('Id', '=', this._recordId);
        Database.query(queryBuilder).then((records) => {
            const record = records[0];
            this._recordId = record.Id;
            this.selectedName = record.Name;
            this.href = '/' + this._recordId;
            this.isValueSelected = true;
            const eventBuilder = EventManager.eventBuilder('select');
            eventBuilder.addValue('value', record);
            eventBuilder.setSource(this.name);
            EventManager.fire(this, eventBuilder.build());
            if (this.blurTimeout) {
                clearTimeout(this.blurTimeout);
            }
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        }).catch((error) => {
            this.error = error;
            this.records = undefined;
            this.recordsResultLabel = 'No se han encontrado registros';
        });
    }
}