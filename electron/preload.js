const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("timerAPI", {
  updateRemaining: (seconds) => {
    ipcRenderer.send("timer:update-remaining", seconds);
  },
  notifyFinished: (payload) => {
    ipcRenderer.send("timer:notify-finished", payload);
  },
});
