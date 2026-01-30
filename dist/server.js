"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const app_1 = require("./app");
const port = config_1.default.port;
app_1.app.listen(port, () => {
    console.log(`Listening to PORT : ${port}`);
});
