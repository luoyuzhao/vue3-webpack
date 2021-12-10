export default class Component {
    _name;
    _component;
    constructor(name) {
        this._name = name;
    }
    apply(component) {
        this._component = component;
        this._component.install=(v) => {
            v.component(this._name, this._component);
        }
        let self=this;
        this._component.created=function(){
            self._component.$vue=this;
        },
        App.use(this._component);
    }
    getData(){
        return this._component.$vue.$data;
    }
    getData(key){
        return this._component.$vue.$data[key];
    }
    setData(key,val){
        let obj= this._component.$vue.$data[key];
        if(obj!=undefined){
            this._component.$vue.$data[key]=val;
        }
        else{
            console.error(`object:[${key}] is undefined.`);
        }
    }
    getComponent() {
        return this._component;
    }
}