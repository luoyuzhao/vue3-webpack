
import Main from './modules/main'
import messages from './lang'
import './styles/style.css'
import './styles/style.less'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
document.oncontextmenu = function (e) {
    return false;
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        const i18n = createI18n({
            locale: "zh",//zh,en
            silentFallbackWarn: true,
            globalInjection: true,
            legacy: false,
            messages
        });
        window.App = createApp({});
        App.use(i18n)
        App.main = new Main();
        App.mount('#app');
    }
}