// @ts-nocheck
export function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export async function getBaseScene(baseScene) {
    return Editor.Message.request('asset-db', 'query-path', baseScene);
}

export async function getPathByUuid(uuid) {
    return await Editor.Message.request('asset-db', 'query-path', uuid);
}

export async function getUrlByUuid(uuid) {
    return await Editor.Message.request('asset-db', 'query-url', uuid);
}

export async function createNewAsset(dest, content) {
    return await Editor.Message.request('asset-db', 'create-asset', dest, content, { overwrite: true });
}

export async function createNewScene(sceneDest, sceneString) {
    return await Editor.Message.request('asset-db', 'create-asset', sceneDest, sceneString, { overwrite: true });
}

export async function compressUUID(txt) {
    return EditorExtends.UuidUtils.compressUuid(txt);
}

export async function refreshAssets() {
    await Editor.Message.request("asset-db", "refresh-asset", "db://assets")
}

export function reverseKeyValuePairs(obj) {
    const reversedObj = {};
    for (const key in obj) {
        reversedObj[obj[key]] = key;
    }
    return reversedObj;
}