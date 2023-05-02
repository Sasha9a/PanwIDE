import * as chokidar from 'chokidar';
import { ipcMain } from 'electron';
import * as fs from 'fs';
import { IpcChannelEnum } from '../../../libs/enums/ipc.channel.enum';
import { ServiceProjectItemInterface } from '../../../libs/interfaces/service.project.item.interface';
import { win } from '../../main';

export const createHandles = () => {
  ipcMain.handle(IpcChannelEnum.SERVICE_PROJECT_START_LOAD_FILES, (event, path: string) => {
    const watcher = chokidar.watch(path);
    watcher.on('ready', async () => {
      const info: ServiceProjectItemInterface[] = [];
      await parseFiles(path, info);
      win.webContents.send(IpcChannelEnum.SERVICE_PROJECT_GET_FILES, info);
    });
  });
};

const parseFiles = async (path: string, info: ServiceProjectItemInterface[]) => {
  const pathStat = fs.statSync(path);
  const isWin = path.includes('\\');

  if (pathStat) {
    const dirName = path.slice(path.lastIndexOf(isWin ? '\\' : '/') + 1);
    const objectInfo: ServiceProjectItemInterface = {
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
        await parseFiles(pathFile, objectInfo.children);
      }
    }
  } else {
    console.error(`Error: Не получилось прочитать файл по пути: ${path}`);
  }
};
