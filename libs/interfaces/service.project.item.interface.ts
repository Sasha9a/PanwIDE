export interface ServiceProjectItemInterface {
  fullPath: string;
  fileType: string;
  isDirectory: boolean;
  children: Record<string, ServiceProjectItemInterface>;
}
