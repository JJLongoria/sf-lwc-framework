import { LightningElement, api, track } from 'lwc';
import CoreUtils from 'c/classCoreUtils';
import EventManager from 'c/classEventManager';

export default class UiSearchInputBox extends LightningElement {

    @api name = 'UiSearchInputBox';
    @api
    get values() {
        return this._values;
    }
    set values(values) {
        this._values = CoreUtils.clone(values);
        this._originalValues = CoreUtils.clone(this._values);
        this.removeFromValues();
    }
    @api
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = CoreUtils.clone(selected);
        this.removeFromValues();
    }
    @api inputPlaceholder = 'Search...';
    @api inputLabel = 'Values';
    @api inputValuesText = 'Values';
    @api boxLabel = 'Selected Values';
    @api iconName = 'standard:account';
    @api iconAltText;
    @api clickable = false;
    @api removeTitle = 'Remove';
    @api removeAllTitle = 'Remove All';

    @track _values = [];
    @track _selected = [];
    @track pills = [];
    _originalValues;

    connectedCallback() {
        console.log(this.name + ' connectedCallback');
        this._originalValues = CoreUtils.clone(this._values);
        this.removeFromValues();
    }

    handleSelect(event) {
        console.log(this.name + ' handleSelect');
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        let eventBuilder = EventManager.eventBuilder();
        eventBuilder.setSource(this.name);
        if (detail.value) {
            for (let i = 0; i < this._values.length; i++) {
                const value = this._values[i];
                if (value.value === detail.value) {
                    this._selected.push(value);
                    this._values.splice(i, 1);
                    break;
                }
            }
            eventBuilder.setName('select');
            eventBuilder.addValue('value', detail.value);
            eventBuilder.addValue('selected', this._selected);
        } else if (detail.values) {
            this._selected = CoreUtils.clone(this._values);
            this._values = [];
            eventBuilder.setName('selectall');
            eventBuilder.addValue('values', detail.values);
            eventBuilder.addValue('selected', this._selected);
        } else {
            eventBuilder = undefined;
        }
        this.pills = [];
        if (this._selected && this._selected.length > 0) {
            for (const value of this._selected) {
                this.pills.push({
                    label: value.label,
                    value: value.value,
                    iconName: this.iconName,
                    iconAltText: this.iconAltText,
                });
            }
        }
        if (eventBuilder) {
            EventManager.fire(this, eventBuilder.build());
        }
    }

    handleClick(event) {
        console.log(this.name + ' handleClick');
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        const dataset = EventManager.getEventDataset(event);
        let eventBuilder = EventManager.eventBuilder();
        eventBuilder.setSource(this.name);
        if (source === 'pillContainer') {
            if (detail.action === 'remove') {
                eventBuilder.setName('remove');
                eventBuilder.addValue('value', detail.value);
                this._selected.splice(detail.index, 1);
                this.pills.splice(detail.index, 1);
                const selectedTmp = [];
                const valuesResult = [];
                for (const value of this._selected) {
                    selectedTmp.push(value.value);
                }
                for (const value of this._originalValues) {
                    if (!selectedTmp.includes(value.value)) {
                        valuesResult.push(value);
                    }
                }
                this._values = valuesResult;
                eventBuilder.addValue('selected', CoreUtils.clone(this._selected));
            } else if (detail.action === 'link') {
                eventBuilder.setName('pillclick');
                eventBuilder.addValue('value', detail.value);
            }
        } else if (source === 'removeAll') {
            this._selected = [];
            this.pills = [];
            this._values = CoreUtils.clone(this._originalValues);
            eventBuilder.setName('removeall');
            const selectedTmp = [];
            for (const value of this._selected) {
                selectedTmp.push(value.value);
            }
            eventBuilder.addValue('values', selectedTmp);
            this._selected = [];
            eventBuilder.addValue('selected', CoreUtils.clone(this._selected));
        } else {
            eventBuilder = undefined;
        }
        if (eventBuilder) {
            EventManager.fire(this, eventBuilder.build());
        }
    }

    removeFromValues() {
        if (CoreUtils.hasElements(this._selected)) {
            const selectedTmp = [];
            const valuesResult = [];
            for (const value of this._selected) {
                selectedTmp.push(value.value);
            }
            for (const value of this._values) {
                if (!selectedTmp.includes(value.value)) {
                    valuesResult.push(value);
                }
            }
            this._values = valuesResult;
        }
    }


}