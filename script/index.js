const electron = require('electron'),
    { ipcRenderer } = electron;
var output;

document.addEventListener('DOMContentLoaded', (params) => {
    output = document.getElementById('cmdOutput');


    document.getElementById('clr')
        .addEventListener('click', ev => {
            output.innerHTML = '';
        })

    document.getElementsByClassName('close')[0]
        .addEventListener('click', ev => {
            ipcRenderer.send('close-win');
        })

    ipcRenderer.on('message-back', (ev, arg) => {
        appendOutput(arg);
    });

    ipcRenderer.on('command-complete', (ev, args) => {
        alert(args);
    })

    ipcRenderer.on('error', (ev, args) => {
        if (console)
            console.error('from main.js', args);
    })
}, false);

function appendOutput(message) {
    let pre = document.createElement('pre');
    pre.innerHTML = message;
    output.append(pre);
    //makes sure we're at the bottom of the chat window
    output.scrollTop = output.scrollHeight;
}

