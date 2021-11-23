import { LightningElement, api } from 'lwc';

export default class UiMessaging extends LightningElement {
    @api title;
    @api subtitle;
    @api message;
    @api messageSize = 'small';
    @api type = 'info';

    get addSeparator(){
        return this.title || this.subtitle;
    }

    get messageStyle() {
        return "white-space: pre-wrap !important; font-size: " + this.messageSize;
    }
}