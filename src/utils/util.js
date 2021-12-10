export default class Util {
    static uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
    static random(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            default:
                return 0;
        }
    }
    static getQueryStr(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return '';
    }
    static clearObject(obj) {
        Object.keys(obj).forEach(key => {
            if(obj[key]){
                if (Array.isArray(obj[key])) {
                    obj[key] = [];
                }
                else if (typeof obj[key] == 'number') {
                    obj[key] = 0;
                }
                else if (typeof obj[key] == 'boolean') {
                    obj[key] = false;
                }
                else if (typeof obj[key] == 'string'){
                    obj[key] = '';
                }
                else if (typeof obj[key] == 'object') {
                    this.clearObject(obj[key])
                }
            }
        })
    }
    static async resolveJavaFunctionAsync(name, data) {
        return await this.callJavaFunction(name, data).catch((reason) => {
            console.error(reason);
        });
    }
    static vueUse(antdObj,app){
        Object.keys(antdObj).forEach(name=>{
            app.use(antdObj[name]);
        })
    }
    static getStorage(key){
        return new Promise((resolve, reject) => {
            let str= localStorage.getItem(key);
            try{
                if(str&&str.length>0){
                    resolve(JSON.parse(str));
                }
                resolve(null);
            }
            catch(err){
                reject(err);
            }
        });
    }
    static setStorage(key,value){
        return new Promise((resolve, reject) => {
            try{
                let str=JSON.stringify(value);
                localStorage.setItem(key,str);
                resolve(true);
            }
            catch(err){
                reject(err);
            }
        });
    }
    static resolveJavaFunction(name, data) {
        return new Promise((resolve, reject) => {
            if (window[name]) {
                const obj = {
                    request: JSON.stringify(data),
                    persistent: false,
                    onSuccess: function (result) {
                        if (result) {
                            let obj = JSON.parse(result)
                            resolve(obj);
                        }
                        else {
                            resolve(null);
                        }
                    },
                    onFailure: function (code, msg) {
                        reject(msg);
                    }
                };
                window[name](obj);
            }
            else {
                const err = `function:window.${name} is not defined.`;
                console.error(err);
                reject(err);
            }
        });
    }
    static registerBrowserFunction(name, callback) {
        if (window[name]) {
            console.error(`function:window.${name} is already registered.`)
            return false;
        }
        else {
            window[name] = callback;
        }
    }
}