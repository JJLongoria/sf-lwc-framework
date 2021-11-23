import { LightningElement } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { loadStyle } from "lightning/platformResourceLoader";

/**
 * Class to handle all utils actions and methods for QuickActions like close, resize...
 */
export default class QuickActionUtils extends LightningElement {

    /**
     * Method to close any Quick Action component created with LWC
     * @param {Object} cmp LWC Quick Action component to close
     */
    static close(cmp){
        cmp.dispatchEvent(new CloseActionScreenEvent());
    }

    /**
     * Method to resize any quick action component modal window
     * @param {Object} cmp LWC Quick Action component to resize
     * @param {Object} style Style to load with the new size
     */
    static resize(cmp, style){
        loadStyle(cmp, style);
    }

}