
import * as tpl from './module1.html'
import Component from '../component'
export default class Module1 extends Component{
    _component = {
        data: () => {
            return {};
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
