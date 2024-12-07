"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFiles = exports.mapNameDir = exports.methods = void 0;
// @ts-nocheck
const path_1 = require("path");
const package_json_1 = __importDefault(require("../package.json"));
const fs_extra_1 = require("fs-extra");
const utils_1 = require("./utils");
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    openPanel() {
        Editor.Panel.open(package_json_1.default.name);
    },
};
const SUITS_MAP = { 2: "heart", 4: "diamond", 5: "spade", 7: "club" };
function mapNameDir(directoryPath = "") {
    if (!directoryPath)
        return Promise.reject();
    console.log("=== Reading directory " + directoryPath + " ===");
    return (0, fs_extra_1.readdir)(directoryPath)
        .then(files => {
        let allPromises = [];
        files.forEach(file => {
            if (file.endsWith(".meta") || file.endsWith(".atlas"))
                return;
            const oldPath = (0, path_1.join)(directoryPath, file);
            let newFileName = "";
            let nameSplit = "";
            file = file.replace(".png", "");
            if (file.length > 2) {
                nameSplit = file.split(".");
            }
            else {
                nameSplit = file.split("");
            }
            const suitName = SUITS_MAP[nameSplit[1]];
            if (!suitName) {
                // mark a to-be deleted name
                console.log(`Delete ${oldPath}`);
                allPromises.push((0, fs_extra_1.rm)(oldPath));
            }
            else {
                newFileName = nameSplit[0] + "_" + suitName + ".png";
                const newPath = (0, path_1.join)(directoryPath, newFileName); // Replace with your desired renaming logic
                console.log(`Renamed ${oldPath} to ${newPath}`);
                allPromises.push((0, fs_extra_1.rename)(oldPath, newPath));
            }
        });
        return Promise.all(allPromises);
    })
        .then(() => {
        console.log("=== Operation Done ===");
        (0, utils_1.refreshAssets)();
    })
        .catch(err => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
    });
}
exports.mapNameDir = mapNameDir;
function removeFiles(directoryPath = "") {
    console.log("=== Deleting cache ===");
    return (0, fs_extra_1.readdir)(directoryPath)
        .then(files => {
        let allPromises = [];
        files.forEach(file => {
            const filePath = (0, path_1.join)(directoryPath, file);
            allPromises.push((0, fs_extra_1.unlink)(filePath));
        });
        return Promise.all(allPromises);
    })
        .catch(err => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
    });
}
exports.removeFiles = removeFiles;
/**
 * TODO:
 *  - Keep the asset original .meta, prevent engine reimport asset
 *  - Create backup for assets at temp dir
 */ 
