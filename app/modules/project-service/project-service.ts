import * as chokidar from 'chokidar';
import * as clipboard from 'clipboard-files';
import { ipcMain } from 'electron';
import * as fs from 'fs';
import moment from 'moment-timezone';
import { IpcChannelEnum } from '../../../libs/enums/ipc.channel.enum';
import { ServiceProjectItemInterface } from '../../../libs/interfaces/service.project.item.interface';
import { win } from '../../main';

let timeFromChangeFiles: moment.Moment;
let changesFileCount = 0;
let path: string;

export const createHandles = () => {
  ipcMain.handle(IpcChannelEnum.SERVICE_PROJECT_START_LOAD_FILES, (event, _path: string) => {
    const watcher = chokidar.watch(_path);
    let isFullLoad = false;
    path = _path;
    watcher.on('ready', async () => {
      await generateFileInfo(_path);
      isFullLoad = true;
    });
    watcher.on('add', () => {
      if (isFullLoad) {
        changesFileCount++;
        timeFromChangeFiles = moment();
      }
    });
    watcher.on('addDir', () => {
      if (isFullLoad) {
        changesFileCount++;
        timeFromChangeFiles = moment();
      }
    });
    watcher.on('unlink', () => {
      changesFileCount++;
      timeFromChangeFiles = moment();
    });
    watcher.on('unlinkDir', () => {
      changesFileCount++;
      timeFromChangeFiles = moment();
    });
    watcher.on('error', (error) => {
      console.error(`Error to work in chokidar: "${error.name}" ${error.message}`);
    });
  });

  ipcMain.handle(IpcChannelEnum.SERVICE_PROJECT_COPY_FILES, (event, _paths: string[]) => {
    clipboard.writeFiles(_paths);
  });

  ipcMain.handle(IpcChannelEnum.SERVICE_PROJECT_START_READ_FILES, () => {
    win.webContents.send(IpcChannelEnum.SERVICE_PROJECT_READ_FILES, clipboard.readFiles());
  });

  ipcMain.handle('startCustomDrag', (event, filesPath: string[]) => {
    const isWin = process.platform === 'win32';
    event.sender.startDrag({
      file: '',
      files: filesPath,
      icon: isWin ? `${__dirname}\\icons\\drag.png` : `${__dirname}/icons/drag.png`
    });
  });
};

export const checkUpdateFiles = async () => {
  if (changesFileCount && moment().diff(timeFromChangeFiles, 'seconds') > 1) {
    changesFileCount = 0;
    await generateFileInfo(path);
  }
};

const generateFileInfo = async (path: string) => {
  const info: ServiceProjectItemInterface[] = [];
  await parseFiles(path, info);
  win.webContents.send(IpcChannelEnum.SERVICE_PROJECT_GET_FILES, info);
};

const parseFiles = async (path: string, info: ServiceProjectItemInterface[]) => {
  const pathStat = fs.statSync(path);
  const isWin = process.platform === 'win32';

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
