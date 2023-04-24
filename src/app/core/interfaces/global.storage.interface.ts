export interface GlobalStorageInterface {
  openDirectory: string;
  leftPanel: {
    isShow: boolean;
    size: number;
  };
  rightPanel: {
    isShow: boolean;
    size: number;
  };
  bottomPanel: {
    isShow: boolean;
    size: number;
  };
}
