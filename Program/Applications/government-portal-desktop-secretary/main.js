const {app, BrowserWindow } = require('electron')
/**
 * "electron:win": "electron-packager ./electron Government Portal --overwrite --asar=true --platform=win32 --prune=true --out=release-builds --version-string.CompanyName=CE --icon=src/assets/icons/win/icon.ico --version-string.FileDescription=CE --version-string.ProductName='Government Portal Office'"
 */
let mainwindow;

function createMainWindow(){
    mainwindow = new BrowserWindow({
        width:1920,
        height:1230,
        icon: `file//${__dirname}/www/assets/icon.ico`,
    })

    mainwindow.maximize();
    mainwindow.show();

    mainwindow.loadURL(`file://${__dirname}/www/index.html`);

    mainwindow.on('closed', function(){
        mainwindow = null
    })
}

app.on('ready',createMainWindow)

app.on('window-all-closed', function (){
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', function(){
    if(win === null){
        createMainWindow
    }
})