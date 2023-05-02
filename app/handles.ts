import * as chokidar from 'chokidar';
import { ipcMain } from 'electron';
import * as fs from 'fs';
import { ServiceProjectItemInterface } from '../libs/interfaces/service.project.item.interface';
import { IpcChannelEnum } from '../src/app/core/enums/ipc.channel.enum';
import { win } from './main';

export const createHandles = () => {
  ipcMain.handle(IpcChannelEnum.SERVICE_PROJECT_START_LOAD_FILES, (event, path: string) => {
    const watcher = chokidar.watch(path);
    watcher.on('ready', async () => {
      const info: Record<string, ServiceProjectItemInterface> = {};
      await parseFiles(path, info);
      win.webContents.send(IpcChannelEnum.SERVICE_PROJECT_GET_FILES, info);
    });
  });
};

const parseFiles = async (path: string, info: Record<string, ServiceProjectItemInterface>) => {
  const pathStat = fs.statSync(path);
  const isWin = path.includes('\\');

  if (pathStat) {
    const dirName = path.slice(path.lastIndexOf(isWin ? '\\' : '/') + 1);
    info[dirName] = {
      name: dirName,
      fullPath: path,
      fileType: dirName.lastIndexOf('.') !== -1 ? dirName.slice(dirName.lastIndexOf('.') + 1) : '',
      children: {},
      isDirectory: pathStat.isDirectory()
    };

    if (pathStat.isDirectory()) {
      const items = fs.readdirSync(path);
      for (let item of items) {
        const pathFile = isWin ? path + '\\' + item : path + '/' + item;
        await parseFiles(pathFile, info[dirName].children);
      }
    }
  } else {
    console.error(`Error: Не получилось прочитать файл по пути: ${path}`);
  }
};
