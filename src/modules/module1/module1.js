
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
