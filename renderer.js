const { ipcRenderer } = require('electron');
let pb = require('./progressbar.js')

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

    $("#play").css('display', 'none');
    $("#downloading").css('display', '');
});

ipcRenderer.on('update_downloaded', () => {
    console.log("Update downloaded!");
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');

    $("#play").css('display', '');
    $("#downloading").css('display', 'none');
});
ipcRenderer.on('download_progress', (percent) => {
    console.log(`Downloaded ${percent}%`);
    $(".progressbar").attr('data-perc', percent);
    pb.updateBar();
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
    $('#close-button').click(function() {
        closeNotification();
    });
    $('#restart-button').click(function() {
        restartApp();
    });
    $('#play').click(function() {
        ipcRenderer.send('play');
    });
});
