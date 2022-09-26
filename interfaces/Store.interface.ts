import type { IUserSettings } from './UserSettings.interface';
import type { IWindowState } from './WindowState.interface';

export interface IStore {
  theme: string;
  lastWindowState: IWindowState;
  userSettings: IUserSettings;
}
