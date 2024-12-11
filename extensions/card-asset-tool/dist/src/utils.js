"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseKeyValuePairs = exports.refreshAssets = exports.compressUUID = exports.createNewScene = exports.createNewAsset = exports.getUrlByUuid = exports.getPathByUuid = exports.getBaseScene = exports.replaceAll = exports.escapeRegExp = void 0;
// @ts-nocheck
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
exports.replaceAll = replaceAll;
async function getBaseScene(baseScene) {
    return Editor.Message.request('asset-db', 'query-path', baseScene);
}
exports.getBaseScene = getBaseScene;
async function getPathByUuid(uuid) {
    return await Editor.Message.request('asset-db', 'query-path', uuid);
}
exports.getPathByUuid = getPathByUuid;
async function getUrlByUuid(uuid) {
    return await Editor.Message.request('asset-db', 'query-url', uuid);
}
exports.getUrlByUuid = getUrlByUuid;
async function createNewAsset(dest, content) {
    return await Editor.Message.request('asset-db', 'create-asset', dest, content, { overwrite: true });
}
exports.createNewAsset = createNewAsset;
async function createNewScene(sceneDest, sceneString) {
    return await Editor.Message.request('asset-db', 'create-asset', sceneDest, sceneString, { overwrite: true });
}
exports.createNewScene = createNewScene;
async function compressUUID(txt) {
    return EditorExtends.UuidUtils.compressUuid(txt);
}
exports.compressUUID = compressUUID;
async function refreshAssets() {
    await Editor.Message.request("asset-db", "refresh-asset", "db://assets");
}
exports.refreshAssets = refreshAssets;
function reverseKeyValuePairs(obj) {
    const reversedObj = {};
    for (const key in obj) {
        reversedObj[obj[key]] = key;
    }
    return reversedObj;
}
exports.reverseKeyValuePairs = reverseKeyValuePairs;
