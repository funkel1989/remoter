process.env.DIST = join(__dirname, '../..');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST, '../public');

import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'os';
import { join } from 'path';
import config from '../store';
import debug from 'electron-debug';
import { ipcMain as betterIpcMain } from 'electron-better-ipc';

import type { ISetStoreData } from '../../interfaces/SetStoreData.interface';
import type { IUserSettings } from '../../interfaces/UserSettings.interface';

import { setPassword } from 'keytar';

betterIpcMain.setMaxListeners(100);

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL as string;
const indexHtml = join(process.env.DIST, 'index.html');

debug({
  isEnabled: true, // TODO: This is only enabled to allow `Command+R` because messenger.com sometimes gets stuck after computer waking up
  showDevTools: false,
});

// function formatSize(size: number) {
//   var i = Math.floor(Math.log(size) / Math.log(1024));

//   return (
//     (size / Math.pow(1024, i)).toFixed(2) * 1 +
//     ' ' +
//     ['B', 'kB', 'MB', 'GB', 'TB'][i]
//   );
// }

// betterIpcMain.answerRenderer('get-appPath', async () => {
//   return app.getAppPath;
// });

// betterIpcMain.answerRenderer('get-filesForPath', async (path: string) => {
//   return readdirSync(path);
// });

// betterIpcMain.answerRenderer('get-filesStats', async (pathData: IFilePath): Promise<IFileData> => {
//   const stats = statSync(join(pathData.path, pathData.file));

//   return {
//     name: pathData.file,
//     size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
//     directory: stats.isDirectory(),
//   };
// });

// betterIpcMain.answerRenderer('open-folder', async (openFolderData: IOpenFolder)=> {
//   return join(openFolderData.path, openFolderData.folder);
// });

// betterIpcMain.answerRenderer('back-folder', async (currentPath: string)=> {
//   return dirname(currentPath);
// });

betterIpcMain.answerRenderer('get-config', async (configName: string) => {
  return config.get(configName);
});

betterIpcMain.answerRenderer(
  'set-userData',
  async (saveConfigObject: string) => {
    console.log(saveConfigObject);

    const parsedData = JSON.parse(
      saveConfigObject
    ) as ISetStoreData<IUserSettings>;

    if (parsedData.data.password) {
      await setPassword(
        'remoter',
        parsedData.data.userName,
        parsedData.data.password
      );

      delete parsedData.data.password;
      config.set(parsedData.configName, parsedData.data);
    }
  }
);

async function createWindow() {
  const lastWindowState = config.get('lastWindowState');

  win = new BrowserWindow({
    title: app.name,
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    minWidth: 400,
    minHeight: 200,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      plugins: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.on('resize', () => {
    const { isMaximized } = config.get('lastWindowState');
    config.set('lastWindowState', { ...win!.getNormalBounds(), isMaximized });
  });

  win.on('maximize', () => {
    config.set('lastWindowState.isMaximized', true);
  });

  win.on('unmaximize', () => {
    config.set('lastWindowState.isMaximized', false);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  });

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg });
  } else {
    childWindow.loadURL(`${url}/#${arg}`);
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
});
