"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandles = void 0;
const chokidar = require("chokidar");
const electron_1 = require("electron");
const fs = require("fs");
const ipc_channel_enum_1 = require("../../../libs/enums/ipc.channel.enum");
const main_1 = require("../../main");
const createHandles = () => {
    electron_1.ipcMain.handle(ipc_channel_enum_1.IpcChannelEnum.SERVICE_PROJECT_START_LOAD_FILES, (event, path) => {
        const watcher = chokidar.watch(path);
        let isFullLoad = false;
        watcher.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
            yield generateFileInfo(path);
            isFullLoad = true;
        }));
        watcher.on('add', () => __awaiter(void 0, void 0, void 0, function* () {
            if (isFullLoad) {
                yield generateFileInfo(path);
            }
        }));
        watcher.on('addDir', () => __awaiter(void 0, void 0, void 0, function* () {
            if (isFullLoad) {
                yield generateFileInfo(path);
            }
        }));
        watcher.on('unlink', () => __awaiter(void 0, void 0, void 0, function* () {
            yield generateFileInfo(path);
        }));
        watcher.on('unlinkDir', () => __awaiter(void 0, void 0, void 0, function* () {
            yield generateFileInfo(path);
        }));
        watcher.on('error', (error) => {
            console.error(`Произошла ошибка при работе с chokidar: "${error.name}" ${error.message}`);
        });
    });
};
exports.createHandles = createHandles;
const generateFileInfo = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const info = [];
    yield parseFiles(path, info);
    main_1.win.webContents.send(ipc_channel_enum_1.IpcChannelEnum.SERVICE_PROJECT_GET_FILES, info);
});
const parseFiles = (path, info) => __awaiter(void 0, void 0, void 0, function* () {
    const pathStat = fs.statSync(path);
    const isWin = path.includes('\\');
    if (pathStat) {
        const dirName = path.slice(path.lastIndexOf(isWin ? '\\' : '/') + 1);
        const objectInfo = {
            name: dirName,
            fullPath: path,
            fileType: dirName.lastIndexOf('.') !== -1 ? dirName.slice(dirName.lastIndexOf('.') + 1) : '',
            children: [],
            isDirectory: pathStat.isDirectory()
        };
        info.push(objectInfo);
        if (pathStat.isDirectory()) {
            const items = fs.readdirSync(path);
            for (let item of items) {
                const pathFile = isWin ? path + '\\' + item : path + '/' + item;
                yield parseFiles(pathFile, objectInfo.children);
            }
        }
    }
    else {
        console.error(`Error: Не получилось прочитать файл по пути: ${path}`);
    }
});
//# sourceMappingURL=project-service.js.map