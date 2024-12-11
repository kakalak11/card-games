"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const main_1 = require("../../main");
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        buttonConfirm: "#buttonConfirm",
        assetPath: "#asset-path"
    },
    methods: {},
    ready() {
        if (this.$.app) {
            this.$.app.innerHTML = 'Card Assets Tool';
        }
        this.$.buttonConfirm.addEventListener('confirm', () => {
            var _a;
            (_a = this.$.buttonConfirm) === null || _a === void 0 ? void 0 : _a.classList.remove("green");
            this.$.buttonConfirm.innerHTML = "Do it";
            const assetPath = this.$.assetPath.value;
            (0, main_1.mapNameDir)(assetPath)
                .then(() => {
                var _a;
                (_a = this.$.buttonConfirm) === null || _a === void 0 ? void 0 : _a.classList.add("green");
                this.$.buttonConfirm.innerHTML = "Done";
            })
                .catch(err => {
                if (err) {
                    console.error(err);
                }
            });
        });
    },
});
