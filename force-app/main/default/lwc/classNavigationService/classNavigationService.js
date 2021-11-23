import { NavigationMixin } from 'lightning/navigation';

/**
 * Class to handle all about the LWC Navigation and the Navigation service
 */
export default class NavigationService {

    /**
     * Method to navigato to any URL including query params
     * @param {Object} cmp Navigation source LWC Component 
     * @param {String} url URL to navigate
     * @param {Object} [params] Query params to add to the url. { 'paramName1': 'value1', 'paramName2': 'value2', ... }
     */
    static goToURL(cmp, url, params) {
        if (params) {
            let index = 0;
            for (const key of Object.keys(params)) {
                if (index === 0) {
                    url += key + '=' + params[key];
                } else {
                    url += '&' + key + '=' + params[key];
                }
                index++;
            }
        }
        cmp[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: url
            }
        });
    }

    /**
     * Method to navigate to Record pages
     * @param {Object} cmp Navigation source LWC Component
     * @param {String} recordId Record id to go to record page
     * @param {Boolean} [newTab] True to open it in a new tab, false in otherwise
     */
    static goToRecordPage(cmp, recordId, newTab) {
        if (recordId) {
            if (newTab) {
                cmp[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: recordId,
                        actionName: 'view',
                    },
                }).then(url => {
                    cmp[NavigationMixin.Navigate]({
                        "type": "standard__webPage",
                        "attributes": {
                            "url": url
                        }
                    });
                });
            }
        }
    }

    /**
     * Method to navigate to a community page
     * @param {Object} cmp Navigation source LWC Component 
     * @param {String} pageName Community Page name to navigate.
     * @param {Object} [params] Optional params to pass to the page like query params into URL. { 'paramName1': 'value1', 'paramName2': 'value2', ... }
     */
    static goToCommunityPage(cmp, pageName, params) {
        cmp[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageName
            },
            state: params
        });
    }

}