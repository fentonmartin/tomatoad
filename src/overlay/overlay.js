const electron = require('electron')
const moment = require('moment')
const path = require('path')

const ipc = electron.ipcRenderer

var audio = new Audio(path.join(__dirname, '..', 'sounds', 'timer.wav'));

let pomodoroRunning = false

const getTimeString = (seconds) => {
    let momentTime = moment.duration(seconds, 'seconds')
    let sec = momentTime.seconds().toString().padStart(2, '0')
    let min = momentTime.minutes().toString().padStart(2, '0')

    return `${min}:${sec}`
}

// Respond to events from Main
ipc.on('pomodoro-start', (evt) => { onStart() })
ipc.on('pomodoro-stop', (evt) => { onStop() })
ipc.on('pomodoro-complete', (evt) => { onComplete() })
ipc.on('break-start', (evt) => { onStart() })
ipc.on('break-stop', (evt) => { onStop() })
ipc.on('break-complete', (evt) => { onComplete() })
ipc.on('countdown', (evt, count) => { document.getElementById('countdown').innerHTML = getTimeString(count); })

onClickStartStop = function () {
    if(pomodoroRunning) {
        onStop()
        ipc.send("pomodoro-stop")
    } else {
        onStart()
        ipc.send("pomodoro-start")
    }
}

function onStart() {
    const el = document.getElementById('overlay-button-start-stop')
    el.classList.remove("fa-play")
    el.classList.add("fa-close")
    pomodoroRunning = true
}

function onStop() {
    const el = document.getElementById('overlay-button-start-stop')
    el.classList.remove("fa-close")
    el.classList.add("fa-play")
    pomodoroRunning = false
}

function onComplete() {
    audio.play();
    onStop()
}