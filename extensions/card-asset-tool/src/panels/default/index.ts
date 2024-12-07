import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { mapNameDir } from '../../main';
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
    template: readFileSync(join(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
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

        this.$.buttonConfirm!.addEventListener('confirm', () => {
            const directoryPath = (this.$.assetPath! as any).value;
            
            mapNameDir(directoryPath)
        });
    },
    beforeClose() { },
    close() { },
});
