import { app, BrowserWindow } from 'electron';
import path from 'path';
import reload from 'electron-reload';
import isDev from 'electron-is-dev';

let mainWindow = null;
if (isDev) {
    const electronPath = path.join(__dirname, "node_modules", ".bin", "electron","components");
    reload(__dirname, { electron: electronPath });
}
app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({width:1000,height:800});

  //mainWindow.webContents.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
