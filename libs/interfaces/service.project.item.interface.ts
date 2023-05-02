export interface ServiceProjectItemInterface {
  name: string;
  fullPath: string;
  fileType: string;
  isDirectory: boolean;
  children: Record<string, ServiceProjectItemInterface>;
}
