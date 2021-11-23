import { LightningElement, api, track } from 'lwc';
import CoreUtils from 'c/classCoreUtils';
import EventManager from 'c/classEventManager';

export default class UiPill extends LightningElement {

    @api name = 'UiPill';
    @api iconName;
    @api iconAltText;
    @api avatar;
    @api avatarTitle;
    @api avatarAltText;
    @api removeTitle;
    @api label;
    @api value;
    @api clickable;
    @api index;
    @api
    get removable() {
        return this._removable;
    }
    set removable(removable) {
        this._removable = removable;
        if (CoreUtils.isNull(this._removable))
            this._removable = true;
    }
    @api
    get error() {
        return this._error;
    }
    set error(error) {
        this._error = error;
        if (this._error)
            this.pillStyle = 'slds-pill slds-has-error';
        else
            this.pillStyle = 'slds-pill';
    }
    @api
    get errorMessage() {
        return this._errorMessage;
    }
    set errorMessage(message) {
        this._errorMessage = message;
    }

    @track _removable = true;
    @track _error = false;
    @track _errorMessage = 'Warning';
    @track pillStyle = 'slds-pill';

    handleClick(event) {
        console.log(this.name + ' handleClick');
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        const dataset = EventManager.getEventDataset(event);
        let eventBuilder = EventManager.eventBuilder();
        eventBuilder.setSource(this.name);
        eventBuilder.addValue('value', this.value);
        eventBuilder.addValue('index', this.index);
        if (source === 'remove') {
            eventBuilder.addValue('action', 'remove');
            eventBuilder.setName('remove');
        } else if (source === 'link') {
            eventBuilder.addValue('action', 'link');
            eventBuilder.setName('pillclick');
        } else {
            eventBuilder = undefined;
        }

        if (eventBuilder) {
            EventManager.fire(this, eventBuilder.build());
        }
    }


}