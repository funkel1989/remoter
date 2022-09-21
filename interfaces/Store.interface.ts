import { IWindowState, IUserSettings } from ".";

export interface IStore {
  theme: string;
  lastWindowState: IWindowState;
  userSettings: IUserSettings;
}
