// @ts-ignore
import { join } from 'path';
import packageJSON from '../package.json';
import { readdir, rename } from 'fs-extra';
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    openPanel() {
        Editor.Panel.open(packageJSON.name);
    },
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load() { }

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload() { }



export function mapNameDir(directoryPath = "") {
    if (!directoryPath) return;
    console.log("=== Reading directory " + directoryPath + " ===");

    readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const oldPath = join(directoryPath, file);
            const newPath = join(directoryPath, 'new_' + file); // Replace with your desired renaming logic

            rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                } else {
                    console.log(`Renamed ${oldPath} to ${newPath}`);
                }
            });
        });
    });
}
