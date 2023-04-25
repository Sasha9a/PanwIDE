"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandles = void 0;
const electron_1 = require("electron");
const ipc_channel_enum_1 = require("../src/app/core/enums/ipc.channel.enum");
const createHandles = () => {
    electron_1.ipcMain.handle(ipc_channel_enum_1.IpcChannelEnum.SERVICE_PROJECT_GET_FILES, (event, arg) => {
        console.log(arg);
        return 'foo';
    });
};
exports.createHandles = createHandles;
//# sourceMappingURL=handles.js.map