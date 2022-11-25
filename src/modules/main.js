
import Component from '../component'
import * as tpl from './main.html'
import Module1 from './module1/module1';
import Module2 from './module2/module2';
import Module3 from './module3/module3';
import { createRouter,createWebHashHistory } from 'vue-router'
import { GlobalStore } from '../store/globalstore'
import { storeToRefs } from 'pinia';
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

    _router = createRouter({
        history: createWebHashHistory(),
        routes: this._routes
    });

    _component = {
        setup() {
            // const store = GlobalStore();
            // const { testData,testDataStr } = storeToRefs(store);
            // store.testDataChanged({A:1,B:2});
        },
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
        this.install(this._component);
        App.use(this._router);
    }
}
