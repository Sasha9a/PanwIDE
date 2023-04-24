export interface ServiceProjectItemInterface {
  fullPath: string;
  isDirectory: boolean;
  children: Record<string, ServiceProjectItemInterface>;
}
