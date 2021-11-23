import { LightningElement } from 'lwc';

export default class EventManager extends LightningElement {

    /**
     * Method to get the vent builder object. The event builder are implemented using builder pattern, that is,
     * You can use the method params to create the event, or use the inner methods to build events easy.
     * 
     *      - setName(name): Method to set the event name
     * 
     *      - addValue(name, value): Method to add values to the event details
     * 
     *      - setSource(source): Method to set the event source to identify event caller
     * 
     *      - build(): Method to build the event and create new CustomEvent() with the builder data.
     * 
     * Like builder pattern, you can call methods on sequences to create events, except build, for example:
     * const eventBuilder = EventManager.eventBuilder();
     * eventBuilder.setName('eventName').setSource('sourceLWC').addValue('name1', value1).addValue('name2', value2)...
     * 
     * @param {String} [name] Event name to identify it
     * @param {Object} [detail] Event data detail. { 'dataName1': value1, 'dataName2': value2, ... }
     * @param {String} [source] Event source to identify caller
     * 
     * @returns {Object} Return an event builder object to build events when fire it.
     */
    static eventBuilder(name, detail, source) {
        return {
            name: name,
            detail: detail,
            source: source,
            setName: function (name) {
                this.name = name;
                return this;
            },
            addValue: function (name, value) {
                if (!this.detail)
                    this.detail = {};
                this.detail[name] = value;
                return this;
            },
            setSource: function (source) {
                this.source = source;
                return this;
            },
            build: function () {
                if (!this.detail)
                    this.detail = {};
                this.detail['source'] = this.source;
                const event = new CustomEvent(this.name, { detail: this.detail });
                return event;
            }
        }
    }

    /**
     * Method to fire events
     * @param {Object} cmp LWC Component to call event
     * @param {CustomEvent} event CustomEvent object with the event data. (Call yourEventBuilderInstance.build() to crete CustomEvent with data)
     */
    static fire(cmp, event) {
        cmp.dispatchEvent(event);
    }

    /**
     * Method to get the event source from several event fields.
     * @param {Object} event Received event on handling event methods
     * 
     * @returns {String} Return the event source name
     */
    static getSource(event) {
        if (event.detail && event.detail.source)
            return event.detail.source;
        if (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.name)
            return event.currentTarget.dataset.name;
        if (event.target && event.target.name)
            return event.target.name;
        if (event.target && event.target.dataset && event.target.dataset.name)
            return event.target.dataset.name;
    }

    /**
     * Method to get the event data detail object
     * @param {Object} event Received event on handling event methods
     * 
     * @returns {Object} Return the Event data detail object. { 'dataName1': value1, 'dataName2': value2, ... }
     */
    static getEventDetail(event) {
        return event.detail;
    }

    /**
     * Method to get the event dataset, that is, an object with all store data into data-field objects
     * @param {Object} event Received event on handling event methods
     * 
     * @returns {Object} Return the dataset object, Data set are all data-field attributes like data-id, data-name, data-index or any data-field that you need. 
     * this object is like: { 'id': value, name: value, index: value, otherfield: value, ... }
     */
    static getEventDataset(event) {
        if (event.currentTarget && event.currentTarget.dataset)
            return event.currentTarget.dataset;
        return undefined;
    }

}