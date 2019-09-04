const { app, BrowserWindow, Menu, Tray } = require('electron');
const exec = require('child_process').exec;
const ipc = require('electron').ipcMain;
const path = require('path');
const nativeImage = require('electron').nativeImage
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win,
    iconPath = null;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1100,
        height: 700,
        frame: false,
        transparent: true,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    iconPath = path.join(__dirname, 'assets/icons/icon.ico');
    const trayIcon = nativeImage.createFromPath(iconPath);

    //create tray 
    tray = new Tray(trayIcon)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'GenORM', type: 'normal', click: function (m, w, e) {
                win.show();
                setTimeout(() => {
                    runGenOrm();
                }, 1000);
            }
        },
        {
            label: 'Sencha Build', type: 'normal', click: function (m, w, e) {
                win.show();
                setTimeout(() => {
                    runAppBuild();
                }, 1000);
            }
        },
        {
            label: 'Exit', type: 'normal', click: () => {
                app.quit();
            }
        }
    ])
    tray.setToolTip(`Mike's Handy Tool!`)
    tray.setContextMenu(contextMenu)

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.
    //win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

//custom code  
ipc.on('close-win', function (event, arg) {
    win.hide();
})

function runGenOrm() {
    let dir = '/dev/ABPathfinder/Source';
    try {
        var process = exec('nant genorm', {
            cwd: dir
        }, (error, stdout, stderr) => {
            outputToWindow('command-complete', 'GenOrm Complete');
        });

        process.stdout.on('data', function (data) {
            outputToWindow('message-back', data);
        });
    } catch (error) {
        outputToWindow('command-complete', 'An Error Occurred');
        writeToConsole(error);
    }
}

function runAppBuild() {
    let dir = "/dev/ABPathfinder/Source/ABPath.Web.UI/Pathfinder/extApps/Pathfinder";
    try {
        var process = exec('sencha app build', {
            cwd: dir
        }, (error, stdout, stderr) => {
            outputToWindow('command-complete', 'Sencha App Build Complete');
        });

        process.stdout.on('data', function (data) {
            outputToWindow('message-back', data);
        });
    } catch (error) {
        outputToWindow('command-complete', 'An Error Occurred');
        writeToConsole(error);
    }
}

function outputToWindow(listener, message) {
    win.webContents.send(listener, message);
}

function writeToConsole(err) {
    outputToWindow('error', err.message);
}


