import { app, BrowserWindow, ipcRenderer, Menu, MenuItem, Notification } from 'electron'
import { globalShortcut } from 'electron'
import path from 'node:path'
import { ipcMain } from "electron"

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let web: BrowserWindow | null
let chat: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
    chat = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        resizable: false,
        width: 300,
        height: 300,
        alwaysOnTop: true,
        transparent: true,
        backgroundColor: "white",
        titleBarStyle: "hidden",
        frame: false
    })

    // Test active push message to Renderer-process.

    ipcMain.handle("openUrl", (e, l) => {
        console.log(l)
        web?.destroy()
        web = new BrowserWindow({
            icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
            show: false,
        })

        web.webContents.on('did-finish-load', () => {
            web?.webContents.send('main-process-message', (new Date).toLocaleString())
        })

        web.webContents.on('dom-ready', () => {
            const curl = web?.webContents.getURL()
            chat?.webContents.send('urlUpdated', curl)
            web?.webContents.executeJavaScript(`function gethtml () {
    return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
    }
    gethtml();`).then(html => {
                console.log(html)
                    new Notification({title:"Sus activity detected",body:"uwuuwuwuwuu"}).show()
                    chat?.webContents.send('isSus', true)
            })

            console.log("LOADED")
        })

        web.maximize()
        web?.loadURL(l)
        web?.show()
        return "OK"
    })


    chat.setTitle("Anti-Sus Browser")
    if (VITE_DEV_SERVER_URL) {
        chat.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        chat.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        web = null
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})


app.whenReady().then(() => {
    // globalShortcut.register("CommandOrControl+/", () => win?.loadURL(VITE_DEV_SERVER_URL))
    // globalShortcut.register("CommandOrControl+.", () => {
    //     win?.webContents.executeJavaScript(`function gethtml () {
    // return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
    // }
    // gethtml();`).then(html => console.log(html))
    // })
}).then(createWindow)
