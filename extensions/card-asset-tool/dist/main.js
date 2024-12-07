"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapNameDir = exports.unload = exports.load = exports.methods = void 0;
// @ts-ignore
const path_1 = require("path");
const package_json_1 = __importDefault(require("../package.json"));
const fs_extra_1 = require("fs-extra");
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    openPanel() {
        Editor.Panel.open(package_json_1.default.name);
    },
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
function load() { }
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() { }
exports.unload = unload;
function mapNameDir(directoryPath = "") {
    if (!directoryPath)
        return;
    console.log("=== Reading directory " + directoryPath + " ===");
    (0, fs_extra_1.readdir)(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        files.forEach(file => {
            const oldPath = (0, path_1.join)(directoryPath, file);
            const newPath = (0, path_1.join)(directoryPath, 'new_' + file); // Replace with your desired renaming logic
            (0, fs_extra_1.rename)(oldPath, newPath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                }
                else {
                    console.log(`Renamed ${oldPath} to ${newPath}`);
                }
            });
        });
    });
}
exports.mapNameDir = mapNameDir;
