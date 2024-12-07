// @ts-nocheck
import { join } from 'path';
import packageJSON from '../package.json';
import { copyFile, existsSync, mkdirSync, read, readdir, rename, rm, unlink } from 'fs-extra';
import { refreshAssets, replaceAll } from './utils';
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    openPanel() {
        Editor.Panel.open(packageJSON.name);
    },
};

const SUITS_MAP = { 2: "heart", 4: "diamond", 5: "spade", 7: "club" }

export function mapNameDir(directoryPath = "") {
    if (!directoryPath) return Promise.reject();
    console.log("=== Reading directory " + directoryPath + " ===");

    return readdir(directoryPath)
        .then(files => {
            let allPromises: any[] = [];
            files.forEach(file => {
                if (file.endsWith(".meta") || file.endsWith(".atlas")) return;

                const oldPath = join(directoryPath, file);
                let newFileName: any = "";
                let nameSplit: any = "";
                file = file.replace(".png", "");

                if (file.length > 2) {
                    nameSplit = file.split(".");
                } else {
                    nameSplit = file.split("");
                }
                const suitName = SUITS_MAP[nameSplit[1]];
                if (!suitName) {
                    // mark a to-be deleted name
                    console.log(`Delete ${oldPath}`);
                    allPromises.push(rm(oldPath));
                } else {
                    newFileName = nameSplit[0] + "_" + suitName + ".png";

                    const newPath = join(directoryPath, newFileName); // Replace with your desired renaming logic
                    console.log(`Renamed ${oldPath} to ${newPath}`);
                    allPromises.push(rename(oldPath, newPath));
                }
            });

            return Promise.all(allPromises);
        })
        .then(() => {
            console.log("=== Operation Done ===");
            refreshAssets();
        })
        .catch(err => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }
        });
}

export function removeFiles(directoryPath = "") {
    console.log("=== Deleting cache ===");
    return readdir(directoryPath)
        .then(files => {
            let allPromises = [];
            files.forEach(file => {
                const filePath = join(directoryPath, file);
                allPromises.push(unlink(filePath))
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

/**
 * TODO:
 *  - Keep the asset original .meta, prevent engine reimport asset
 *  - Create backup for assets at temp dir
 */