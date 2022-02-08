export default class Util {
    static uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substring(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substring((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
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
    static removeArrayItem(key, value, arr) {
        if (Array.isArray(arr)) {
            for (var i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (item[key] === value) {
                    arr.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }
    static randomColor(alpha) {
        let r = this.random(1, 255);
        let g = this.random(1, 255);
        let b = this.random(1, 255);
        return `rgba(${r},${g},${b},${alpha})`;
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
    static sleep(time) {
        var startTime = new Date().getTime() + parseInt(time, 10);
        while (new Date().getTime() < startTime) { }
    };
    static clearObject(obj) {
        Object.keys(obj).forEach(key => {
            if (obj[key]) {
                if (Array.isArray(obj[key])) {
                    obj[key] = [];
                }
                else if (typeof obj[key] == 'number') {
                    obj[key] = 0;
                }
                else if (typeof obj[key] == 'boolean') {
                    obj[key] = false;
                }
                else if (typeof obj[key] == 'string') {
                    obj[key] = '';
                }
                else if (typeof obj[key] == 'object') {
                    this.clearObject(obj[key])
                }
            }
        })
    }

    static vueUse(antdObj, app) {
        Object.keys(antdObj).forEach(name => {
            app.use(antdObj[name]);
        })
    }
    static getStorages(...keys) {
        return new Promise((resolve, reject) => {
            try {
                let res = new Object();
                keys.forEach((key) => {
                    let str = sessionStorage.getItem(key);
                    if (str && str.length > 0) {
                        res[key] = JSON.parse(str);
                    }
                })
                resolve(res);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    static getStorage(key) {
        return new Promise((resolve, reject) => {
            let str = sessionStorage.getItem(key);
            try {
                if (str && str.length > 0) {
                    resolve(JSON.parse(str));
                }
                resolve(null);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    static setStorage(key, value) {
        return new Promise((resolve, reject) => {
            try {
                let str = JSON.stringify(value);
                sessionStorage.setItem(key, str);
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    static resolveJavaFunction(name, data) {
        if (data == undefined) {
            data = null;
        }
        return new Promise((resolve, reject) => {
            if (window[name]) {
                const obj = {
                    request: JSON.stringify(data),
                    persistent: false,
                    onSuccess: function (result) {
                        if (result) {
                            try {
                                let obj = JSON.parse(result)
                                resolve(obj);
                            }
                            catch {
                                resolve(result);
                            }
                        }
                        else {
                            resolve(null);
                        }
                    },
                    onFailure: function (code, msg) {
                        reject(msg);
                    }
                };
                if (typeof (data) == 'string') {
                    obj.request = data;
                }
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
    static ObjectContans(obj, filter, fullExp, ...keys) {
        let f = filter.toLowerCase();
        keys = keys.filter(key => {
            let value = obj[key];
            if (value) {
                if (fullExp) {
                    return value.toLowerCase() === f;
                }
                else {
                    return value.toLowerCase().indexOf(f) > -1;
                }
            }
            return false;
        })
        return keys.length > 0;
    }
    static getOperatorSymbol(str) {
        let symbol = str.match(/>=|<=|>|<|=/);
        if (symbol) {
            return symbol.toString();
        }
        return null;
    }
    static compareStr(src, target, symbol) {
        switch (symbol) {
            case '>=': return src >= target;
            case '<=': return src <= target;
            case '=': return src == target;
            case '>': return src > target;
            case '<': return src < target;
            default: return false;
        }
    }
}