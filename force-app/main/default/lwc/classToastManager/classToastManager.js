import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/**
 * class to create any toast from any LWC component
 */
export default class ToastManager extends LightningElement {

    /**
     * Method to create Success Toasts
     * @param {Object} cmp LWC Component to create toast
     * @param {String} title Toast Title
     * @param {String} [message] Toast Message
     * @param {String} [linkLabel] Toast link label if you want to create a link on toast
     * @param {String} [linkUrl] Toast link URL if you want to create a link on toast
     */
    static showSuccessToast(cmp, title, message, linkLabel, linkUrl){
        ToastManager.showToast(cmp, title, message, 'success', getMessageData(linkLabel, linkUrl));
    }

    /**
     * Method to create Information Toasts
     * @param {Object} cmp LWC Component to create toast
     * @param {String} title Toast Title
     * @param {String} [message] Toast Message
     * @param {String} [linkLabel] Toast link label if you want to create a link on toast
     * @param {String} [linkUrl] Toast link URL if you want to create a link on toast
     */
    static showInfoToast(cmp, title, message, linkLabel, linkUrl){
        ToastManager.showToast(cmp, title, message, 'info', getMessageData(linkLabel, linkUrl));
    }

    /**
     * Method to create Warning Toasts
     * @param {Object} cmp LWC Component to create toast
     * @param {String} title Toast Title
     * @param {String} [message] Toast Message
     * @param {String} [linkLabel] Toast link label if you want to create a link on toast
     * @param {String} [linkUrl] Toast link URL if you want to create a link on toast
     */
    static showWarningToast(cmp, title, message, linkLabel, linkUrl){
        ToastManager.showToast(cmp, title, message, 'warning', getMessageData(linkLabel, linkUrl));
    }

    /**
     * Method to create Error Toasts
     * @param {Object} cmp LWC Component to create toast
     * @param {String} title Toast Title
     * @param {String} [message] Toast Message
     * @param {String} [linkLabel] Toast link label if you want to create a link on toast
     * @param {String} [linkUrl] Toast link URL if you want to create a link on toast
     */
    static showErrorToast(cmp, title, message, linkLabel, linkUrl){
        ToastManager.showToast(cmp, title, message, 'error', getMessageData(linkLabel, linkUrl));
    }

    /**
     * Method to create any toast
     * @param {Object} cmp LWC Component to create toast
     * @param {String} title Toast Title
     * @param {String} [message] Toast Message
     * @param {String} [variant] Toast variant. Info by default.
     * @param {String} [messageData] Message data object to create links or other toast features
     */
    static showToast(cmp, title, message, variant, messageData){
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant | 'info',
            messageData: messageData
        });
        cmp.dispatchEvent(evt);
    }

}

function getMessageData(linkLabel, linkUrl){
    if(linkLabel && linkUrl){
        return [{label: linkLabel, url: linkUrl}];
    }
    return undefined;
}