"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.app.listen({
    port: 3003
}).then(() => {
    console.log('🚀 HTTP Server Runing!');
});
