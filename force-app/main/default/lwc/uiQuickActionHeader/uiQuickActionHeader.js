import { LightningElement, api } from 'lwc';
import modal_default from "@salesforce/resourceUrl/ltn_modal_default";
import modal_xx_small from "@salesforce/resourceUrl/ltn_modal_xx_small";
import modal_x_small from "@salesforce/resourceUrl/ltn_modal_x_small";
import modal_small from "@salesforce/resourceUrl/ltn_modal_small";
import modal_medium from "@salesforce/resourceUrl/ltn_modal_medium";
import modal_large from "@salesforce/resourceUrl/ltn_modal_large";

import EventManager from 'c/classEventManager';

const STYLE_VALUE_MAP = {
    'default': modal_default,
    'xx-small': modal_xx_small,
    'x-small': modal_x_small,
    'small': modal_small,
    'medium': modal_medium,
    'large': modal_large
}

export default class UiQuickActionHeader extends LightningElement {

    @api name = 'UiQuickActionHeader';
    @api title;
    @api resize;

    handleSelect(event){
        console.log(this.name + ' handleSelect()');
        const detail = EventManager.getEventDetail(event);
        const value = detail.value;
        const style = STYLE_VALUE_MAP[value];
        const eventBuilder = EventManager.eventBuilder('resize');
        eventBuilder.addValue('style', style);
        eventBuilder.setSource(this.name);
        EventManager.fire(this, eventBuilder.build());
    }

}