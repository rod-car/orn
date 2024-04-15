import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let loginWindow: BrowserWindow | null = null
let mainWindow: BrowserWindow | null = null

function createLoginWindow(): void {
    loginWindow = new BrowserWindow({
        width: 400,
        height: 600,
        autoHideMenuBar: true,
        maximizable: false,
        resizable: false,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        loginWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/auth.html')
    } else {
        loginWindow.loadFile(join(__dirname, '../renderer/auth.html'))
    }

    loginWindow.on('closed', () => {
        loginWindow = null
    })
}

function createWindow(): void {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow?.maximize()
        // mainWindow?.webContents.openDevTools()
        mainWindow?.show()
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

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createLoginWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on('logged-in', (event, data) => {
    loginWindow?.close()
    createWindow()
})

ipcMain.on('logged-out', (event, data) => {
    mainWindow?.close()
    createLoginWindow()
})
