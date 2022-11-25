/*
*组件基类
*/
export default class Component {
    constructor(name) {
        this._name = name;
        this._hijackVueCreated = (object, method, callback) => {
            let origin = object[method]
            object[method] = callback(origin)
        }
    }
    
    install(component) {
        let self = this;
        self._component = component;
        if (component.created) {
            self._hijackVueCreated(self._component, 'created', function(createdFunc){
                return function() {
                    self.$vue = this;
                    createdFunc();
                }
            });
        }
        else{
            self._component.created = function () {
                self.$vue = this;
            }
        }
        self._component.install = (v) => {
            v.component(self._name, self._component);
        }
        App.use(self._component);
    }
    getData() {
        return this.$vue.$data;
    }
    getData(key) {
        return this.$vue.$data[key];
    }
    setData(key, val) {
        this.$vue.$data[key] = val;
    }
    getComponent() {
        return this._component;
    }
}