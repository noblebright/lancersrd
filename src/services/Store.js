import React from "react";
import { get } from "./NetService";

export const StoreContext = React.createContext("store");

//renamed tags to tagDefs to avoid conflicting definitions with usages.
const fields = ["pilotGear", "coreBonuses", "shells", "weapons", "systems", "actions", "statuses", "tagDefs"];

const sources = [
    "https://raw.githubusercontent.com/noblebright/lancerdata/master/core.json",
    "https://raw.githubusercontent.com/noblebright/lancerdata/master/GMS.json",
    "https://raw.githubusercontent.com/noblebright/lancerdata/master/IPS-N.json"
];

export function load() {
    return Promise.all(sources.map(url => get(url))).then(transformStore);
}

function transformStore(results) {
    const store = { corps: {}, licenses: {} };
    fields.forEach(field => store[field] = {});
    results.forEach((result, idx) => {
        processSource(store, result, sources[idx]);
        if(result.licenses) {
            processLicenses(store, result);
        }
    });
    store.loaded = true;
    console.log(store);
    return store;
}

//TODO: Unify license and non-license recursive processing
function processSource(store, result, url) {
    result.meta.url = url;
    if(!result.meta.dummyCorp) {
        store.corps[result.meta.corpId] = result.meta;
    }
    fields.forEach(field => {
        if(result[field]) {
            processCollection(store, result.meta, result[field], field);
        }
    });
}

function processCollection(store, meta, collection, category, licenseInfo, parentType, parentId) {
    collection.forEach(item => {
        item.corpId = meta.corpId;
        item.author = meta.author;
        item.srcUrl = meta.url;
        store[category][item.id] = item;
        if(licenseInfo) {
            item.license = Object.assign(item.license || {}, licenseInfo);
        }
        if(parentType && parentId) {
            item.parentType = parentType;
            item.parentId = parentId;
        }
        fields.forEach(field => {
            if(item[field]) {
                processCollection(store, meta, item[field], field, licenseInfo, category, item.id);
            }
        });
    });
}

function processLicenses(store, result) {
    const corpId = result.meta.corpId;
    if(!store.licenses[corpId]) {
        store.licenses[corpId] = {};
    }
    Object.keys(result.licenses).forEach(licenseId => {
        const { name, summary, flavor, levels } = result.licenses[licenseId];
        store.licenses[corpId][licenseId] = { name, summary, flavor, id: licenseId };
        levels && levels.forEach((collection, licenseLevel) => {
            fields.forEach(field => {
                if(collection[field]) {
                    processCollection(store, result.meta, collection[field], field, { line: licenseId, level: licenseLevel + 1 });
                }
            });
        })
    });
}

export function withStore(Component) {
    return (props) => (
        <StoreContext.Consumer>
            { store => <Component {...props} store={store}/> }
        </StoreContext.Consumer>
    );
}