const { ipcRenderer } = require('electron');

const version = document.getElementById('version');
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    version.innerText = 'Version ' + arg.version;
});

ipcRenderer.on('update_available', () => {
    console.log("Update available!");
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
    console.log("Update downloaded!");
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

function closeNotification() {
    notification.classList.add('hidden');
}

function restartApp() {
    ipcRenderer.send('restart_app');
}

ipcRenderer.on("prog", (event, html) => {
    console.log('Got event')
    $("#prog").html(html);
});

$(document).ready(function() {
    ipcRenderer.send('fire');
});
