import { Pipe, PipeTransform } from '@angular/core';
import { ServiceProjectItemInterface } from '../../../../libs/interfaces/service.project.item.interface';

const fileTypes: string[] = ['amx', 'cfg', 'exe', 'inc', 'md', 'pwn', 'txt'];
const exeFileNames: string[] = ['announce', 'samp-npc', 'samp03srv'];
const gitFileNames: string[] = ['.gitignore'];

@Pipe({
  name: 'fileTypeImagePath',
  standalone: true
})
export class FileTypeImagePathPipe implements PipeTransform {
  public transform(info: ServiceProjectItemInterface): string {
    const pathFileTypes = 'assets/icons/file-type/';
    if (info.isDirectory) {
      return pathFileTypes.concat('directory.png');
    } else if (fileTypes.includes(info.fileType)) {
      return pathFileTypes.concat(info.fileType, '.png');
    } else if (exeFileNames.includes(info.name)) {
      return pathFileTypes.concat('exe.png');
    } else if (gitFileNames.includes(info.name)) {
      return pathFileTypes.concat('git.png');
    } else {
      return pathFileTypes.concat('file.png');
    }
    return '';
  }
}
