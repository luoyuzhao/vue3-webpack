
import * as tpl from './module3.html'
import Component from '../component'
export default class Module3 extends Component{
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
        super('m-module3');
        this.apply(this._component);
    }
}
