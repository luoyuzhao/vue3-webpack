import { defineStore } from 'pinia'
export const GlobalStore = defineStore('main', {
    state: () => ({
        testData:{},
    }),
    getters: {
        testDataStr(state){
            return JSON.stringify(state.testData);
        }
    },
    actions: {
        testDataChanged(data) {
            this.testData=data;
        },
    },
})