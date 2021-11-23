import { LightningElement, api } from 'lwc';
import DOMUtils from 'c/classDOMUtils';
import EventManager from 'c/classEventManager';

export default class UiCheckBoxTile extends LightningElement {

    @api name = 'UiCheckBoxTile';
    @api label;
    @api itemId;
    @api detail;
    @api checked;
    @api tooltip;
    @api disabled;
    @api actions;
    @api actionsIcon;
    @api actionsTitle = 'Actions';

    connectedCallback() {

    }

    handleChange(event) {
        const input = DOMUtils.queryByDataName(this, 'checkbox');
        const eventBuilder = EventManager.eventBuilder('tilechange');
        eventBuilder.setSource(this.name);
        eventBuilder.addValue('id', this.itemId);
        eventBuilder.addValue('value', input.checked);
        EventManager.fire(this, eventBuilder.build());
    }

    handleClick(event) {
        const eventBuilder = EventManager.eventBuilder('tileclick');
        eventBuilder.setSource(this.name);
        eventBuilder.addValue('id', this.itemId);
        EventManager.fire(this, eventBuilder.build());
    }

    handleActionClick(event) {
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
        const eventBuilder = EventManager.eventBuilder('action');
        eventBuilder.setSource(this.name);
        eventBuilder.addValue('id', this.itemId);
        eventBuilder.addValue('action', detail.value);
        EventManager.fire(this, eventBuilder.build());
    }
}