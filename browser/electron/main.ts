import { app, BrowserWindow, Notification } from 'electron'
import path from 'node:path'
import fs from "fs"
import { ipcMain } from "electron"
import arweave from "arweave"
import { message, results, createDataItemSigner } from "@permaweb/aoconnect"
import * as crypto from "crypto"
import axios from "axios"

const BACKEND_BASE = "http://192.168.235.116:1240"

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

const ar = arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

let jwk: any;
let signer: any;

const arwallet_path = path.join(__dirname, "/.anti-sus.json")
if (!fs.existsSync(arwallet_path)) {
    ar.wallets.generate().then((key) => {
        jwk = key
        fs.writeFile(arwallet_path, JSON.stringify(key), (r) => console.log(r))
        // signer = createDataItemSigner(jwk)
    })
}


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
        height: 350,
        maximizable: false,
        alwaysOnTop: true,
        transparent: true,
        backgroundColor: "white",
        titleBarStyle: "hidden",
        frame: false
    })

    // Test active push message to Renderer-process.


    ipcMain.handle("summary-load", async (_, __) => {
        const url = web?.webContents.getURL()
        const sussy_html = await axios.post(BACKEND_BASE + "/check_html", { url })
        console.log(sussy_html.data)
        chat?.webContents.send('summary', sussy_html.data)


    })

    ipcMain.handle("openUrl", (_, l) => {
        console.log(l)
        web?.destroy()
        web = new BrowserWindow({
            icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
            show: false,
        })

        // const whois = "https://api.api-ninjas.com/v1/whois?domain="
        // const domainFixed = l.replace("https://", "").replace("http://", "").replace("://", "")
        // axios.get(whois + domainFixed, { headers: { "X-api-key": "XO1iqd3CLYl3dSoQO/dKSw==rt3bXWIlb0PYjQ4h" } })
        //     .then(r => console.log(r.data)).catch(e => console.log("whois error", e))

        web.on('closed', () => {
            chat?.webContents.send('isSus', false)

        })

        web.webContents.on('did-finish-load', () => {
            web?.webContents.send('main-process-message', (new Date).toLocaleString())
        })

        web.webContents.on('dom-ready', async () => {
            const curl = web?.webContents.getURL()
            chat?.webContents.send('urlUpdated', curl)

            const sussy = await axios.post(BACKEND_BASE + "/check", { url: curl })
            const isSus = sussy.data.split("\n")[0].split(" ").reverse()[0];
            console.log(isSus)
            if (isSus > 0.018) {
                new Notification({ title: "Suspicious activity detected", body: "Please stay alert" }).show()
                chat?.webContents.send('isSus', true)
            } else {
                chat?.webContents.send('isSus', false)
            }


            // html
            // web?.webContents.executeJavaScript(`function gethtml () {
            // return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
            // }
            // gethtml();`).then(async (html) => {
            //     // console.log(html)


            //     const htmlres = await axios.post(BACKEND_BASE + "/check_html", { html })
            //     console.log(htmlres.data)
            // const mid = message({
            //     process: "rFEI-vxph87d7YmdOTeWX1im1Q6_fSvtSYdrRxlwsvw",
            //     signer: jwk,
            //     tags: [{
            //         name: "Action",
            //         value: "Register"
            //     }],
            //     data: ""
            // }).then(r => console.log(r))

            // })

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


app.whenReady().then(async () => {
    // globalShortcut.register("CommandOrControl+/", () => win?.loadURL(VITE_DEV_SERVER_URL))
    // globalShortcut.register("CommandOrControl+.", () => {
    //     win?.webContents.executeJavaScript(`function gethtml () {
    // return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
    // }
    // gethtml();`).then(html => console.log(html))
    // })

}).then(createWindow)
