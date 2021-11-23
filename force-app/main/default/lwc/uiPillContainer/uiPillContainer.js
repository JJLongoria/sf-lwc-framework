import { LightningElement, api, track } from 'lwc';
import CoreUtils from 'c/classCoreUtils';
import EventManager from 'c/classEventManager';

export default class UiPillContainer extends LightningElement {

    @api name = 'UiPillContainer';
    @api label;
    @api
    get values() {
        return this._values;
    }
    set values(values) {
        this._values = values;
    }

    @track _values;

    handleClick(event) {
        console.log(this.name + ' handleClick');
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        const dataset = EventManager.getEventDataset(event);
        let eventBuilder = EventManager.eventBuilder();
        eventBuilder.setSource(this.name);
        eventBuilder.addValue('value', detail.value);
        eventBuilder.addValue('index', detail.index);
        eventBuilder.addValue('action', detail.action);
        if (source === 'pill') {
            if (detail.action === 'remove') {
                eventBuilder.setName('remove');
            } else if (detail.action === 'link') {
                eventBuilder.setName('pillclick')
            }
        } else {
            eventBuilder = undefined;
        }
        if (eventBuilder) {
            EventManager.fire(this, eventBuilder.build());
        }
    }

}