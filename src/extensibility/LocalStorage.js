import localStore from "store";
import { loadSource } from "../services/Store";

export function addSource(src, store) {
    localStore.set(src, true);
    return loadSource(store, src);
}

export function getSources() {
    const list = [];
    localStore.each((v, k) => list.push(k));
    return list;
}

export function deleteSource(src, store) {
    localStore.remove(src);
    return Promise.resolve(store);
}