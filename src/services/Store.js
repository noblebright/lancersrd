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
    buildIndexes(store);
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
        item.componentType = category;
        store[category][item.id] = item;
        if(licenseInfo) {
            item.license = Object.assign(item.license || {}, licenseInfo);
        } else {
            item.license = item.license || {};
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

function buildIndexes(store) {
    let licenseMap = Object.keys(store.licenses).reduce((acc, corp) => {
        Object.keys(store.licenses[corp]).forEach(license => acc[license] = corp);
        return acc;
    }, {});

    let licenseIndex = {};
    //init licenseIndex
    Object.keys(licenseMap).forEach(licenseId => {
        licenseIndex[licenseId] = licenseId ? { corp: licenseMap[licenseId], levels: [] } : { corp: licenseMap[licenseId], starter: []} ;
    });

    ["weapons", "systems", "shells"].forEach(field => {
       Object.keys(store[field]).forEach(key => {
           const item = store[field][key];
           if(!item.license.line && !item.license.talent) { //starter gear
               if(!licenseIndex[""]) {
                   console.warn(`no starter equipment corp detected!`);
                   return;
               }
               licenseIndex[""].starter.push({id: item.id, componentType: field});
           } else {
               if(!item.license.line) {
                   return; //skip talent items for now.
               }
               if(!item.license.level) {
                   console.warn(`no license level found in ${field} ${item.id}"`);
                   return;
               }
               if(!licenseIndex[item.license.line]) {
                   console.warn(`no license holder found for "${item.license.line} in ${field} ${item.id}"`);
                   return;
               }
               if(!licenseIndex[item.license.line].levels[item.license.level - 1]) {
                   licenseIndex[item.license.line].levels[item.license.level - 1] = [];
               }
               licenseIndex[item.license.line].levels[item.license.level - 1].push({id: item.id, componentType: field});
           }
       });
    });
    store.licenseIndex = licenseIndex;
}

export function withStore(Component) {
    return (props) => (
        <StoreContext.Consumer>
            { store => <Component {...props} store={store}/> }
        </StoreContext.Consumer>
    );
}