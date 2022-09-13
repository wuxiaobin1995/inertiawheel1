/*
 * @Author: your name
 * @Date: 2020-01-07 11:13:05
 * @LastEditTime: 2021-12-16 15:55:19
 * @LastEditors : Please set LastEditors
 * @Description: 入口文件
 * @FilePath: \inertiawheel1\src\main\index.js
 */
import { app, BrowserWindow, Menu } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  // 创建一个窗口
  mainWindow = new BrowserWindow({
    show: false,
    nodeIntegration: true, // ture则集成Node，默认为false
    webPreferences: {
      webSecurity: false
    }
  })

  // 永久删除菜单栏，快捷键也会删除
  Menu.setApplicationMenu(null)
  // 窗口默认最大化打开
  mainWindow.maximize()

  // 渲染进程
  mainWindow.loadURL(winURL)

  // // 生产环境中，是否打开开发者工具
  // mainWindow.webContents.openDevTools()

  // 关闭时触发，清空mainWindow
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * @description: 初始化时调用
 */
app.on('ready', createWindow)

/**
 * @description: 针对macOS系统
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * @description: 针对macOS系统
 */
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
