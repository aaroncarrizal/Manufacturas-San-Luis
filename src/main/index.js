import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import backend from './backend/main'
import { execSync } from 'child_process'
import os from 'os'
import fs from 'fs'
import path from 'path'

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 850,
        height: 900,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : { icon }),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

export async function print(part, model) {
    let filePath
    try {
        // Determine QR Code size
        let qrSize = 4
        let textSize = 15
        if(part.qr.length >= 15){
            qrSize = 3
            textSize = 12
        }
        // Create zpl file
        const user = os.userInfo().username
        filePath = path.join(`C:\\Users\\${user}\\Documents`, `${part.tokenId}.zpl`)
        const zpl = `^XA
        ^FO5,5
        ^BXN,${qrSize},200
        ^FD${part.qr}^FS

        ^LH0,0
        ^FO80,30^A0B,${textSize},12^FD${part.qr}^FS

        ^FO120,5
        ^A0N,22,22
        ^FD${model.digits}^FS

        ^FO110,25^GB20,10,10^FS
        ^FO145,25^GB20,10,10^FS

        ^FO95,40
        ^A0N,15,15
        ^FD${model.reference}^FS

        ^FO125,60
        ^A0N,12,12
        ^FD${part.tokenId}^FS

        ^XZ`

        fs.writeFileSync(filePath, zpl) // Write your content to the file
        // Get name of the PC
        const hostname = os.hostname()

        // const command = `COPY /B "${filePath}" "\\\\${hostname}\\ZDesigner"`
        const command = `start explorer.exe ${filePath}`

        const stdout = execSync(command).toString() // Execute the command synchronously and capture the output as a string
        console.log(`Command output:\n${stdout}`)
        return Promise.resolve('Document sent to printer successfully')
    } catch (error) {
        console.error(error)
        return Promise.reject(`Error: ${error.message}`)
    } finally {
        setTimeout(() => {
            fs.unlinkSync(filePath)
        }, 5000)
    }
}
