import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  globalShortcut,
  dialog ,
  app
} from 'electron';
import Store from 'electron-store';
import { useState } from 'react';
import hotkeys from 'hotkeys-js';

export default (windowName: string, options: BrowserWindowConstructorOptions): BrowserWindow => {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win;
  globalShortcut.unregisterAll(); 
  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };
   
  const ensureVisibleOnSomeDisplay = windowState => {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults. 
      return resetToDefaults();
    }
    return windowState;
  };
 
  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };
 
  state = ensureVisibleOnSomeDisplay(restore());
 
  const browserOptions: BrowserWindowConstructorOptions = { 
    ...state,
    ...options,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      ...options.webPreferences,
    }, 
    autoHideMenuBar: true,
    
    
    fullscreen: true,
    
    alwaysOnTop:true,
  };
    // const [warn,setwarn]=useState(0);
  win = new BrowserWindow(browserOptions);
  win.webContents.on('before-input-event', async (event, input) => {
   await event.preventDefault();
    // console.log("pin prevent function",input,"displaying event",event.preventDefault); 
    if (input.meta || input.metaKey || input.alt || input.control) {
      event.preventDefault();
       globalShortcut.unregisterAll();
      
      await dialog.showMessageBox({
        type: 'warning',
        title: 'Detecting plagarism',
        message: `This is to inform that plag has been detected from your end we will close this application.`,
        buttons: ['OK']
      });
       
      

       
    } 
  }); 

  
 



  win.on('close', saveState);

  return win;
};

