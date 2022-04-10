import { LightningElement, api, track } from 'lwc';
import EventManager from 'c/classEventManager';

const TEXT_TYPE = 'text';
const NUMBER_TYPE = 'number';
const DATE_TYPE = 'date';
const ID_TYPE = 'id';
const BOOLEAN_TYPE = 'bool';
const PICKLIST_TYPE = 'picklist';

const EQUALS_OPERATOR = '=';
const IN_OPERATOR = 'in';
const NOT_IN_OPERATOR = 'not in';
const NOT_EQUALS_OPERATOR = '!=';
const GREATER_THAN_OPERATOR = '>';
const GREATER_THAN_OR_EQUALS_OPERATOR = '>=';
const LESS_THAN_OPERATOR = '<';
const LESS_THAN_OR_EQUALS_OPERATOR = '<=';
const STARTS_WITH_OPERATOR = 'like \'{0}%\'';
const ENDS_WITH_OPERATOR = 'like \'%{0}\'';
const CONTAINS_WITH_OPERATOR = 'like \'%{0}%\'';

const DATE_OPERATORS = [
    { label: 'Igual a', value: EQUALS_OPERATOR },
    { label: 'Distinto de', value: NOT_EQUALS_OPERATOR },
    { label: 'Mayor que', value: GREATER_THAN_OPERATOR },
    { label: 'Mayor o Igual que', value: GREATER_THAN_OR_EQUALS_OPERATOR },
    { label: 'Menor que', value: LESS_THAN_OPERATOR },
    { label: 'Menor o Igual que', value: LESS_THAN_OR_EQUALS_OPERATOR },
];

const TEXT_OPERATORS = [
    { label: 'Igual a', value: EQUALS_OPERATOR },
    { label: 'Distinto de', value: NOT_EQUALS_OPERATOR },
    { label: 'Contiene', value: CONTAINS_WITH_OPERATOR },
    { label: 'Comienza Por', value: STARTS_WITH_OPERATOR },
    { label: 'Termina Por', value: ENDS_WITH_OPERATOR },
    { label: 'Anterior que', value: LESS_THAN_OPERATOR },
    { label: 'Anterior o Igual que', value: LESS_THAN_OR_EQUALS_OPERATOR },
    { label: 'Posterior que', value: GREATER_THAN_OPERATOR },
    { label: 'Posterior o Igual que', value: GREATER_THAN_OR_EQUALS_OPERATOR },
    { label: 'En el conjunto', value: IN_OPERATOR },
    { label: 'Fuera del conjunto', value: NOT_IN_OPERATOR },    
];

const PICKLIST_OPERATORS = [
    { label: 'Igual a', value: EQUALS_OPERATOR },
    { label: 'Distinto de', value: NOT_EQUALS_OPERATOR },
    { label: 'Contiene', value: CONTAINS_WITH_OPERATOR },
    { label: 'Comienza Por', value: STARTS_WITH_OPERATOR },
    { label: 'Termina Por', value: ENDS_WITH_OPERATOR },
    { label: 'En el conjunto', value: IN_OPERATOR },
    { label: 'Fuera del conjunto', value: NOT_IN_OPERATOR },    
];

const ID_OPERATORS = [
    { label: 'Igual a', value: EQUALS_OPERATOR },
    { label: 'Distinto de', value: NOT_EQUALS_OPERATOR },
    { label: 'Anterior que', value: LESS_THAN_OPERATOR },
    { label: 'Anterior o Igual que', value: LESS_THAN_OR_EQUALS_OPERATOR },
    { label: 'Posterior que', value: GREATER_THAN_OPERATOR },
    { label: 'Posterior o Igual que', value: GREATER_THAN_OR_EQUALS_OPERATOR },
    { label: 'En el conjunto', value: IN_OPERATOR },
    { label: 'Fuera del conjunto', value: NOT_IN_OPERATOR },
];

const NUMBER_OPERATORS = [
    { label: 'Igual a', value: EQUALS_OPERATOR },
    { label: 'Distinto de', value: NOT_EQUALS_OPERATOR },
    { label: 'Mayor que', value: GREATER_THAN_OPERATOR },
    { label: 'Mayor o Igual que', value: GREATER_THAN_OR_EQUALS_OPERATOR },
    { label: 'Menor que', value: LESS_THAN_OPERATOR },
    { label: 'Menor o Igual que', value: LESS_THAN_OR_EQUALS_OPERATOR },
    { label: 'En el conjunto', value: IN_OPERATOR },
    { label: 'Fuera del conjunto', value: NOT_IN_OPERATOR },
];

const BOOLEAN_OPERATORS = [
    { label: 'Igual a', value: EQUALS_OPERATOR },
    { label: 'Distinto de', value: NOT_EQUALS_OPERATOR },
];

const OPERATORS_BY_TYPE = {};
OPERATORS_BY_TYPE[TEXT_TYPE] = TEXT_OPERATORS;
OPERATORS_BY_TYPE[NUMBER_TYPE] = NUMBER_OPERATORS;
OPERATORS_BY_TYPE[DATE_TYPE] = DATE_OPERATORS;
OPERATORS_BY_TYPE[ID_TYPE] = ID_OPERATORS;
OPERATORS_BY_TYPE[BOOLEAN_TYPE] = BOOLEAN_OPERATORS;
OPERATORS_BY_TYPE[PICKLIST_TYPE] = PICKLIST_OPERATORS;

export default class UiOperatorSelectorInput extends LightningElement {

    @api name = 'UiOperatorSelectorInput';
    @api label;
    @api value;
    @api placeholder;
    @api
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
        if (!OPERATORS_BY_TYPE[this._type])
            this._type = TEXT_TYPE;
        this.options = OPERATORS_BY_TYPE[this._type];
    }
    @api disabled;
    @api required;
    @api messageWhenValueMissing;

    @track _type = TEXT_TYPE;
    @track options = TEXT_OPERATORS;

    handleChange(event) {
        console.log(this.name + ' handleSelect()');
        const detail = EventManager.getEventDetail(event);
        const eventBuilder = EventManager.eventBuilder('select');
        eventBuilder.addValue('value', detail.value);
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
    }

}