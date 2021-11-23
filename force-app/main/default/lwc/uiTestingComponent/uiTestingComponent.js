// IMPORT LIBS
import { LightningElement, api, track } from 'lwc';
import Database from 'c/classDatabase';
import ToastManager from 'c/classToastManager';
import ErrorManager from 'c/classErrorManager';
import EventManager from 'c/classEventManager';
import CoreUtils from 'c/classCoreUtils';
import QuickActionUtils from 'c/classQuickActionUtils';

export default class UiProducibleBillableServices extends LightningElement {

    @api recordId;
    @api objectApiName;


    connectedCallback() {
        console.log('connectedCallback');
    }

    disconnectedCallback() {
        console.log('disconnectedCallback');
    }

    renderedCallback() {
        console.log('renderedCallback');
      
    }

    handleResize(event) {
        console.log('handleResize');
        const detail = EventManager.getEventDetail(event);
        QuickActionUtils.resize(this, detail.style);
    }

    handleClick(event) {
        console.log('handleClick');
        QuickActionUtils.close(this);
    }
}