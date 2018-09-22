import React from "react";
import { get } from "./NetService";

export const StoreContext = React.createContext("store");

const fields = ["pilotGear", "coreBonuses", "shells", "weapons", "systems", "actions", "statuses", "tags", "talents"];

const sources = ["https://gist.githubusercontent.com/noblebright/4f3c03becfc1b8133b965be0e33e4660/raw/736ef44a0f722aea09fdedc94f1beec5e539c16a/GMS.json"];

export function load() {
    return Promise.all(sources.map(url => get(url))).then(transformStore);
}

function transformStore(results) {
    const store = { corps: {} };
    fields.forEach(field => store[field] = {});
    results.forEach(result => {
        processSource(store, result);
    });
    store.loaded = true;
    console.log(store);
    return store;
}

function processSource(store, result) {
    store.corps[result.meta.abbrev] = result.meta;
    fields.forEach(field => {
        result[field] && result[field].forEach(item => {
            item.source = result.meta.abbrev;
            store[field][item.id] = item;
            processItem(store, item, field, item.source);
        });
    });
}

function processItem(store, item, type, source) {
    fields.forEach(field => {
        item[field] && Object.keys(item[field]).forEach(key => {
            store[field][key] = { ...item[field][key], id: key, source, parentType: type, parentId: item.id };
        });
    });
}
export function withStore(Component) {
    return (props) => (
        <StoreContext.Consumer>
            { store => <Component {...props} store={store}/> }
        </StoreContext.Consumer>
    );
}