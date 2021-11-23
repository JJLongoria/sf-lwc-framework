import { LightningElement, api, track } from 'lwc';
import EventManager from 'c/classEventManager';

export default class UiBasicTile extends LightningElement {

    @api name = 'UiBasicTile';
    @api label;
    @api itemId;
    @api detail;
    @api icon;
    @api avatar;
    @api actions;
    @api actionsIcon;
    @api actionsTitle = 'Actions';
    @api twoColumns = false;
    @api
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
        if (this._type === 'media')
            this.standard = false;
    }

    standard = true;
    _type;
    @track layoutSize = 6;


    connectedCallback() {
        if (this.twoColumns)
            this.layoutSize = 4;
    }

    handleClick(event) {
        const source = EventManager.getSource(event);
        const detail = EventManager.getEventDetail(event);
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