
import * as tpl from './module2.html'
import Component from '../component'
export default class Module2 extends Component{
    _component = {
        data: () => {
            return {};
        },
        template: tpl,
        mounted:()=>{
           
        }
    }
    constructor() {
        super('m-module2');
        this.apply(this._component);
    }
}
