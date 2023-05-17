export interface CopyPathItemInterface {
  label: string;
  result: string;
  type: 'absolutePath' | 'fileName' | 'localPath';
  key?: string;
}
