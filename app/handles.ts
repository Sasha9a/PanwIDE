import { ipcMain } from 'electron';
import { IpcChannelEnum } from '../src/app/core/enums/ipc.channel.enum';

export const createHandles = () => {
  ipcMain.handle(IpcChannelEnum.SERVICE_PROJECT_GET_FILES, (event, arg) => {
    console.log(arg);
    return 'foo';
  });
};
