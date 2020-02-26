const { app, BrowserWindow, dialog, ipcMain, remote } = require('electron');
const { autoUpdater } = require('electron-updater');

let win = null;
const path = require ('path');
const isDev = require('electron-is-dev');
let execPath = path.dirname (app.getPath ('exe'));

const server = 'https://rphlauncher.dr3adx.now.sh/'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`

autoUpdater.setFeedURL(feed)
//
setInterval(() => {
    autoUpdater.checkForUpdates()
}, 10000)


function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')
    win.webContents.openDevTools()
    console.log("Ready to show triggered");

    autoUpdater.checkForUpdates();
}

app.whenReady().then(createWindow)

app.on('browser-window-created',function(e,window) {
    window.setMenu(null);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

autoUpdater.on('update-available', () => {
    console.log('Update is available!');
    win.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded!');

    win.webContents.send('update_downloaded');
});

var request = require('request');
var fs = require('fs');


function downloadFile(file_url , targetPath){
    // Save variable to know progress
    var received_bytes = 0;
    var total_bytes = 0;

    var req = request({
        method: 'GET',
        uri: file_url
    });

    var out = fs.createWriteStream(targetPath);
    req.pipe(out);

    req.on('response', function ( data ) {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length' ]);
    });

    req.on('data', function(chunk) {
        // Update the received bytes
        received_bytes += chunk.length;

        showProgress(received_bytes, total_bytes);
    });

    req.on('end', function() {
        //dialog.showMessageBox("File succesfully downloaded");
    });
}

function showProgress(received,total){
    var percentage = (received * 100) / total;
    let pl = percentage + "% | " + received + " bytes out of " + total + " bytes.";
    win.webContents.send("prog", pl);
    //win.webContents.send("prog", 'Test');

}

ipcMain.on('fire', (event) => {

    var fileURL = "https://tanknite.io/static/client/sprites/bullet_oldd.png";
// butterfly-wallpaper.jpeg
    var filename = getFilenameFromUrl(fileURL);
    var downloadsFolder = execPath;
    console.log(downloadsFolder)

    function getFilenameFromUrl(url){
        return url.substring(url.lastIndexOf('/') + 1);
    }

    var finalPath = downloadsFolder + "\\" + filename;

    downloadFile(fileURL, finalPath);
})
