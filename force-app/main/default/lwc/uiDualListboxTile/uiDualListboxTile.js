import { LightningElement, api, track } from 'lwc';
import EventManager from 'c/classEventManager';
import CoreUtils from 'c/classCoreUtils';

export default class DualListboxTile extends LightningElement {

    @api name = 'DualListboxTile';
    @api label;
    @api sourceLabel = 'Available';
    @api selectedLabel = 'Selected';
    @api tooltip;
    @api emptyOptionsText;
    @api emptyValuesText;
    @api disabled;
    @api order;
    @api
    get min() {
        return this._min;
    }
    set min(min) {
        this._min = (min < 0) ? undefined : min;
    }
    @api
    get max() {
        return this._max;
    }
    set max(max) {
        this._max = (max < 0) ? undefined : max;
    }
    @api
    get options() {
        return this._options;
    }
    set options(options) {
        this._options = CoreUtils.clone(options || []);
        this.hasOptions = CoreUtils.hasElements(this._options);
        this.addCheckedField(this._options);
    }
    @api
    get values() {
        return this._values;
    }
    set values(values) {
        this._values = CoreUtils.clone(values || []);
        this.hasValues = CoreUtils.hasElements(this._values);
        this.addCheckedField(this._values);
    }

    @track _min;
    @track _max;
    @track _options = [];
    @track _values = [];
    @track hasOptions;
    @track hasValues;

    connectedCallback() {
        console.log(this.name + ' connectedCallback');
        if (CoreUtils.hasElements(this._values)) {
            const optionsResult = [];
            const valuesTmp = [];
            for (const value of this._values) {
                valuesTmp.push(value.id);
            }
            for (const option of this._options) {
                if (option) {
                    if (!valuesTmp.includes(option.id)) {
                        optionsResult.push(option);
                    }
                }
            }
            this._options = optionsResult;
        }
    }

    addCheckedField(list) {
        if (CoreUtils.hasElements(list)) {
            for (const value of list) {
                if (!CoreUtils.hasKey(value, 'checked'))
                    value['checked'] = false;
            }
        }
    }

    getSelecteOptions() {
        const items = [];
        if (CoreUtils.hasElements(this._options)) {
            for (const option of this._options) {
                if (option.checked)
                    items.push(option.id);
            }
        }
        return items;
    }

    getSelectedValues() {
        const items = [];
        if (CoreUtils.hasElements(this._values)) {
            for (const value of this._values) {
                if (value.checked)
                    items.push(value.id);
            }
        }
        return items;
    }

    getOption(id) {
        if (CoreUtils.hasElements(this._options)) {
            for (const option of this._options) {
                if (option.id === id)
                    return option;
            }
        }
        return undefined;
    }

    getValue(id) {
        if (CoreUtils.hasElements(this.value)) {
            for (const value of this.value) {
                if (value.id === id)
                    return value;
            }
        }
        return undefined;
    }

    handleClick(event) {
        console.log(this.name + ' handleClick');
        const sourceName = EventManager.getSource(event);
        const dataset = EventManager.getEventDataset(event);
        const detail = EventManager.getEventDetail(event);
        let eventBuilder = EventManager.eventBuilder();
        eventBuilder.setSource(this.name);
        if (sourceName === 'up') {
            const up = this.up();
            if (up) {
                eventBuilder.setName('order');
                eventBuilder.addValue('values', this._values);
            }
        } else if (sourceName === 'down') {
            const down = this.down();
            if (down) {
                eventBuilder.setName('order');
                eventBuilder.addValue('values', this._values);
            }
        } else if (sourceName === 'add') {
            const added = this.add();
            if (added) {
                this.hasOptions = CoreUtils.hasElements(this._options);
                this.hasValues = CoreUtils.hasElements(this._values);
                eventBuilder.setName('add');
                eventBuilder.addValue('new', added);
                eventBuilder.addValue('values', this._values);
            }
        } else if (sourceName === 'remove') {
            const removed = this.remove();
            if (removed) {
                this.hasOptions = CoreUtils.hasElements(this._options);
                this.hasValues = CoreUtils.hasElements(this._values);
                eventBuilder.setName('remove');
                eventBuilder.addValue('old', removed);
                eventBuilder.addValue('values', this._values);
            }
        } else if (sourceName === 'options') {
            const elementId = detail.id;
            eventBuilder.setName('optionclick');
            eventBuilder.addValue('id', elementId);
            eventBuilder.addValue('value', this.getOption(elementId));
        } else if (sourceName === 'values') {
            const elementId = detail.id;
            eventBuilder.setName('valueclick');
            eventBuilder.addValue('id', elementId);
            eventBuilder.addValue('value', this.getValue(elementId));
        } else {
            eventBuilder = undefined;
        }
        if (eventBuilder && eventBuilder.name) {
            const newEvent = eventBuilder.build();
            console.log('newEvent');
            console.log(newEvent);
            EventManager.fire(this, eventBuilder.build());
        }
    }

    handleChange(event) {
        console.log(this.name + ' handleChange');
        const sourceName = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        let eventBuilder = EventManager.eventBuilder();
        eventBuilder.setSource(this.name);
        if (sourceName === 'options') {
            for (const option of this._options) {
                if (option.id === detail.id) {
                    option.checked = detail.value;
                    break;
                }
            }
            const elementId = detail.id;
            eventBuilder.setName('optionchange');
            eventBuilder.addValue('id', elementId);
            eventBuilder.addValue('value', detail.value);
        } else if (sourceName === 'values') {
            for (const value of this._values) {
                if (value.id === detail.id) {
                    value.checked = detail.value;
                    break;
                }
            }
            const elementId = detail.id;
            eventBuilder.setName('valuechange');
            eventBuilder.addValue('id', elementId);
            eventBuilder.addValue('value', detail.value);
        } else {
            eventBuilder = undefined;
        }
        if (eventBuilder) {
            EventManager.fire(this, eventBuilder.build());
        }
    }

    up() {
        console.log(this.name + ' up');
        if (CoreUtils.hasElements(this._values)) {
            const result = CoreUtils.clone(this._values);
            for (let i = 0; i < this._values.length; i++) {
                const element = this._values[i];
                if (element.checked) {
                    if (i > 0) {
                        const previousElement = this._values[i - 1];
                        result[i - 1] = element;
                        result[i] = previousElement;
                    }
                }
            }
            this._values = result;
            return true;
        }
        return false;
    }

    down() {
        console.log(this.name + ' down');
        if (CoreUtils.hasElements(this._values)) {
            const result = CoreUtils.clone(this._values);
            for (let i = 0; i < this._values.length; i++) {
                const element = this._values[i];
                if (element.checked) {
                    if (i < this._values.length - 1) {
                        const nextElement = this._values[i + 1];
                        result[i] = nextElement;
                        result[i + 1] = element;
                    }
                }
            }
            this._values = result;
            return true;
        }
        return false;
    }

    add() {
        console.log(this.name + ' add');
        const selectedOptions = this.getSelecteOptions();
        let added = [];
        if (CoreUtils.hasElements(selectedOptions)) {
            const optionsResult = [];
            for (const option of this._options) {
                if (option) {
                    if (selectedOptions.includes(option.id) && (!this._max || this._values.length < this._max)) {
                        option.checked = false;
                        this._values.push(option);
                        added.push(option.id);
                    } else {
                        optionsResult.push(option);
                    }
                }
            }
            if (added.length > 0) {
                this._options = optionsResult;
                return added;
            } else {
                return false;
            }
        }
        return false;
    }

    remove() {
        console.log(this.name + ' remove');
        let removed = [];
        const selectedValues = this.getSelectedValues();
        if (CoreUtils.hasElements(selectedValues)) {
            const valuesResult = [];
            let nValues = this._values.length;
            for (const value of this._values) {
                if (value) {
                    if (selectedValues.includes(value.id) && (!this._min || nValues > this._min)) {
                        value.checked = false;
                        this._options.push(value);
                        nValues--;
                        removed.push(value.id);
                    } else {
                        valuesResult.push(value);
                    }
                }
            }
            if (removed.length > 0) {
                this._values = valuesResult;
                return removed;
            } else {
                return false;
            }
        }
        return false;
    }
}