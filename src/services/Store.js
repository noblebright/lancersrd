import React from "react";
import { get } from "./NetService";

export const StoreContext = React.createContext("store");

const fields = ["pilotGear", "coreBonuses", "shells", "weapons", "systems", "actions", "statuses", "tags"];

const sources = ["https://gist.githubusercontent.com/noblebright/4f3c03becfc1b8133b965be0e33e4660/raw/6bc90d9f03dc8fde94eac25ad7ae45ba99c9049d/GMS.json"];

export function load() {
    return Promise.all(sources.map(url => get(url))).then(transformStore);
}

function transformStore(results) {
    const store = { corps: {} };
    fields.forEach(field => store[field] = {});
    results.forEach(result => {
        store.corps[result.meta.abbrev] = result.meta;
        fields.forEach(field => {
            result[field] && result[field].forEach(item => {
                item.source = result.meta.abbrev;
                store[field][item.id] = item;
            });
        });
    });
    store.loaded = true;
    return store;
}

export function withStore(Component) {
    return (props) => (
        <StoreContext.Consumer>
            { store => <Component {...props} store={store}/> }
        </StoreContext.Consumer>
    );
}