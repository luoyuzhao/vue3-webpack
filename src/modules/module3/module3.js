
import * as tpl from './module3.html'
import Component from '../../component'
export default class Module3 extends Component{
    _component = {
        data: () => {
            return {};
        },
        template: tpl,
        mounted:()=>{
           
        }
    }
    constructor() {
        super('m-module3');
        this.install(this._component);
    }
}
