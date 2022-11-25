# vue-without-cli
无需vue-cli 创建复杂的结构和臃肿的打包环境。分离UI，样式和逻辑

webpack仅打包工程代码 vue仅需要router i18n pinia.

Note:

1.在面临复杂的第三方库时，例如Openlayers，Echart 不建议cdn引用 采用局部import引用打包

2.在确定要完整引用库文件，才采用cdn方式

3.本例仅为Vue3.x

4.在面临Electron或其它WebView客户端场景时,建议启用路径替换,在常规服务器环境不建议这么做

在webpack.config.js中

new ConfigRefPlugin(["thirdParty", "static"])


start:

1. cnpm install

2. create module


```
import * as tpl from './module1.html'
import Component from '../component'
export default class Module1 extends Component{
    _data = {};
    _component = {
        data: () => {
            return this._data;
        },
        template: tpl,
        mounted:()=>{
           
        }
    }
    constructor() {
        super('m-module1');
        this.apply(this._component);
    }
}
```
npm run dev for development

npm run build for production
