export interface IFilePath {
  path: string;
  file: string;
}

export interface IFileData {
  name: string;
  size: string | null;
  directory: boolean;
}

export interface IOpenFolder {
    path: string;
    folder: string;
}
