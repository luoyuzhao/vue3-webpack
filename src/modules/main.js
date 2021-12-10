
import Component from './component'
import * as tpl from './main.html'
import Module1 from './module1/module1';
import Module2 from './module2/module2';
import Module3 from './module3/module3';
import { createStore } from 'vuex'
import { createRouter,createWebHashHistory } from 'vue-router'
export default class Main extends Component {
    _data = {};
    _module1 = new Module1();
    _module2 = new Module2();
    _module3 = new Module3();
    _routes = [
        { path: '/', redirect: '/module1' },
        { path: '/module1', component: this._module1.getComponent() },
        { path: '/module2', component: this._module2.getComponent() },
        { path: '/module3', component: this._module3.getComponent() }
    ]
    _store = createStore({
        state: {},
        getters: {},
        mutations: {},
        actions: {},
        modules: {
            module1: this._module1,
            module2: this._module2,
            module3: this._module3
        }
    });
    _router = createRouter({
        history: createWebHashHistory(),
        routes: this._routes
    });

    _component = {
        data: () => {
            return this._data;
        },
        methods: {
            menuClick(name) {
                this.$router.push(name).catch(err => { });
            }
        },
        mounted() {
            let self=this;
            self.$EventBus.on('msg',()=>{
                //dosomething
            });
            this.$EventBus.emit("msg");
        },
        unmounted(){
            this.$EventBus.off('msg');
        },
        template: tpl
    }
    constructor() {
        super('main-app')
        this.apply(this._component);
        App.use(this._router);
        App.use(this._store);
    }
}
