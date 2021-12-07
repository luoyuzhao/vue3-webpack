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
        App.use(this._component);
    }
    getComponent() {
        return this._component;
    }
}