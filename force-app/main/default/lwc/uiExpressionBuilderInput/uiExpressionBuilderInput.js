import { LightningElement, api, track } from 'lwc';
import CoreUtils from 'c/classCoreUtils';
import EventManager from 'c/classEventManager';
import SchemaUtils from 'c/classSchemaUtils';

const LOGIC_VALUE_AND = 'and';
const LOGIC_VALUE_OR = 'or';
const LOGIC_VALUE_CUSTOM = 'custom';
const LOGIC_LABEL_AND = 'Todas las Condiciones';
const LOGIC_LABEL_OR = 'Alguna Condición';
const LOGIC_LABEL_CUSTOM = 'Personalizado';

const LOGIC_OPTIONS = [
    { label: LOGIC_LABEL_AND, value: LOGIC_VALUE_AND },
    { label: LOGIC_LABEL_OR, value: LOGIC_VALUE_OR },
    { label: LOGIC_LABEL_CUSTOM, value: LOGIC_VALUE_CUSTOM }
];

const TEXT_TYPE = 'text';
const NUMBER_TYPE = 'number';
const DATE_TYPE = 'date';
const ID_TYPE = 'id';
const BOOLEAN_TYPE = 'bool';
const PICKLIST_TYPE = 'picklist';

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
    'multipicklist': PICKLIST_TYPE,
    'percent': NUMBER_TYPE,
    'phone': TEXT_TYPE,
    'picklist': PICKLIST_TYPE,
    'reference': ID_TYPE,
    'string': TEXT_TYPE,
    'textarea': TEXT_TYPE,
    'time': DATE_TYPE,
    'url': TEXT_TYPE,
}


export default class UiExpressionBuilderInput extends LightningElement {

    @api name = 'UiExpressionBuilderInput';
    @api title = 'Condiciones';
    @api objectApiName = 'Account';
    @api disabled = false;
    @api showApiNames = false;
    @api loadingTitle = 'Cargando datos...';

    @track logicValue = LOGIC_VALUE_AND;
    @track logicOptions = LOGIC_OPTIONS;
    @track customLogic = false;
    @track andLogic = true;
    @track orLogic = false;
    @track customLogicValue;
    @track expressions = [];
    @track availableFields = [];
    @track objectData;
    @track operatorsType = TEXT_TYPE;
    @track loading;
    @track readonly;

    connectedCallback(){
        if (!this.objectData) {
            this.loading = true;
            SchemaUtils.describeSObject(this.objectApiName).then((objData) => {
                this.objectData = objData;
                this.loading = false;
            }).catch((error) => {
                this.loading = false;
                console.log(error);
            });
        }
    }

    handleChange(event) {
        console.log(this.name + ' handleChange()');
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        if (source === 'logicOptions') {
            this.logicValue = detail.value;
            this.andLogic = this.logicValue === LOGIC_VALUE_AND;
            this.orLogic = this.logicValue === LOGIC_VALUE_OR;
            this.customLogic = this.logicValue === LOGIC_VALUE_CUSTOM;
        }
    }

    handleClick(event) {
        console.log(this.name + ' handleClick()');
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        if (source === 'addCondition') {
            this.expressions.push({
                id: 'expression' + this.expressions.length,
                label: 'Condición ' + (this.expressions.length + 1),
                position: this.expressions.length + 1,
                showLogicValue: this.expressions.length > 0,
                fieldData: undefined,
                operator: undefined,
                value: undefined,
                datatype: undefined,
            });
        } else if (source === 'removeCondition') {
            const index = detail.index;
            this.expressions.splice(index, 1);
        }
    }

    handleSelect(event) {
        console.log(this.name + ' handleSelect()');
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        const dataset = EventManager.getEventDataset(event);
        if(source === 'field'){
            console.log(detail.value);
            this.expressions[dataset.index].fieldData = detail.value;
            this.operatorsType = OPERATORS_BY_DATATYPE[this.expressions[dataset.index].fieldData.datatype];
        } else if(source === 'operator'){
            this.expressions[dataset.index].operator = detail.value;
        }
    }

    handleRemove(event) {
        console.log(this.name + ' handleRemove()');
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        const dataset = EventManager.getEventDataset(event);
        if(source === 'field'){
            this.expressions[dataset.index].fieldData = undefined;
            this.operatorsType = OPERATORS_BY_DATATYPE[TEXT_TYPE];
        }
    }
}