import { app,screen,globalShortcut, BrowserWindow  } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';


const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}
  
(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // mainWindow.webContents.openDevTools();
//const displays = screen.getAllDisplays(); 
// console.log(displays,"All current displays")
  }
  
})();
app.on('browser-window-focus', function (event, input) {
  globalShortcut.register("CommandOrControl+r", () => {
      console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("F5", () => {
      console.log("F5 is pressed: Shortcut Disabled");
  });
  globalShortcut.register("a+s+d",()=>{
    app.quit();
  })

globalShortcut.register("Super+Tab",()=>{
  console.log("window+tab is pressed");
})
});  
app.on('window-all-closed', () => {
  app.quit();
});
