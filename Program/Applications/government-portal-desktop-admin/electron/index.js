const { app, BrowserWindow, Menu, globalShortcut, session, dialog, nativeTheme } = require('electron');

const isDevMode = require('electron-is-dev');
const OperatingSystem = require("os");
const { CapacitorSplashScreen, configCapacitor } = require('@capacitor/electron');
if (require('electron-squirrel-startup')) return;
const path = require('path');
// Set Default Theme on System
nativeTheme.themeSource = 'system';

// Gets application version details
app.whenReady().then(() => {
  globalShortcut.register(process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I', () => {
    const options = {
      type: 'info',
      buttons: ['Close'],
      title: 'Government Portal Admin',
      message: 'Software Information',
      detail:
        "Version: " + app.getVersion() +
        "\nDeveloper: Ranul Ladduwahetty (Student ID: 10673986)\n" +
        "Module Code: PRCO303SL\n" +
        "Module Name: Computing Project\n" +
        "Current OS: " +
          OperatingSystem.type +
          OperatingSystem.release +
          "\n" +
        "Credits: Special Thanks to my supervisor, without his supervision and guidance this work would not have been possible.\nAll authors where illustrations or dependencies were taken have been credited were possible." +
        "\n\nAbout: Developed for module PRCO303SL coursework by Ranul Ladduwahetty, Student at University of Plymouth.\n",
    };
    dialog.showMessageBox(null, options);
  })
})
// Log out for service
app.whenReady().then(() => {
  globalShortcut.register(process.platform === 'darwin' ? 'Alt+Cmd+S' : 'Alt+Shift+S', () => {
    const options = {
      type: 'warning',
      defaultId: 1,
      buttons: ['Close', 'Restart System', 'Reset System'],
      title: 'Government Portal Admin',
      message: 'Service Request',
      detail: 'Please Note that Resetting will log you out and all existing data will be purged.',
    };

    dialog.showMessageBox(options).then((choice) => {

      console.log(choice.response);
      if (choice.response == 1) {
        app.relaunch();
        app.quit();
      }
      else if (choice.response == 2) {
        session.defaultSession.clearStorageData().then(async (data) => {
          app.relaunch();
          app.quit();
        })
      }
    })
  })
})

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = true;

// Create simple menu for easy devtools access, and for demo
const menuTemplateDev = [
  {
    label: 'Options',
    submenu: [
      {
        label: 'Open Dev Tools',
        click() {
          mainWindow.openDevTools();
        },
      },
    ],
  },
];
Menu.setApplicationMenu(false)
async function createWindow() {
  // Define our main window size
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1280,
    show: false,
    icon: `file://${__dirname}/app/assets/icon/icon.ico`,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
    }
  });

  configCapacitor(mainWindow);

  if (isDevMode) {
    // Set our above template to the Menu Object if we are in development mode, dont want users having the devtools.
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
    // If we are developers we might as well open the devtools by default.
    mainWindow.webContents.closeDevTools();
  }

  if (useSplashScreen) {
    splashScreen = new CapacitorSplashScreen(mainWindow);
    splashScreen.init();
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
    });
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Define any IPC or other custom functionality below here
