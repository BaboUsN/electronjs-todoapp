const electron = require("electron");
const url = require("url");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { app, BrowserWindow, Menu, ipcMain, webContents } = electron;

// define variable
let mainWindow;
const todoArr = [];

//funstarter
(async () => {
  // we can check information with await usage
  appStarter();
  actionListener();
  uploadTodosToInterface();
})();

function appStarter() {
  app.on("ready", () => {
    mainWindow = new BrowserWindow({
      width: 900,
      height: 600,
      frame: true, // border remover

      // es6 require issue solver
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    mainWindow.setResizable(false); // resize blocker
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "./pages/main/main.html"),
        protocol: "file:",
        slashes: true,
      })
    );
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on("close", () => {
      app.quit();
    });
  });
}

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "add todo",
        click(item, focusedWindow) {
          createWindow(200, 300);
        },
      },
      {
        label: "delete all",
      },
      {
        label: "exit",
        accelerator: process.platform == "darwin" ? "Comand+Q" : "Ctrl+Q",
        role: "quit",
      },
    ],
  },
];
if (process.platform == "darvin") {
  mainMenuTemplate.unshift({
    label: app.getName(),
    role: "Todo",
  });
}
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Dev Tools",
    submenu: [
      {
        label: "Geliştirici Konsolu",
        accelerator: "F12",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        label: "Yenile",
        role: "reload",
      },
    ],
  });
}

function createWindow(height, width) {
  addWindow = new BrowserWindow({
    width,
    height,
    title: "new Window",
  });
  add.setResizable(false); // resize blocker

  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "modal.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  addWindow.on("close", () => {
    addWindow = null;
  });
}

function actionListener() {
  // click button listener
  ipcMain.on("key", (err, data) => {
    console.log(data);
  });

  // open windows listener
  ipcMain.on("key:openwindow", () => {
    createWindow(200, 300);
    console.log("Open Window");
  });

  // create new todo data
  ipcMain.on("todo:newTodoData", (err, data) => {
    const d = new Date();
    let todoTemp = {
      id: uuidv4(),
      date: d.getTime(),
      title: data,
    };
    todoArr.push(todoTemp);
    mainWindow.webContents.send("backend-todo:addItem", todoArr);
  });
  ipcMain.on("todo:deleteTodo", (err, data) => {
    let itemIndex = -1;

    // use typical loop cause foreach fun doesnt support to break
    for (let i = 0; i < todoArr.length; i++) {
      if (todoArr[i].id == data) {
        itemIndex = i;
        break;
      }
    }
    if (itemIndex !== -1) {
      todoArr.splice(itemIndex, 1);
      mainWindow.webContents.send("backend-todo:addItem", todoArr);
    }
  });
  ipcMain.on("todo:deleteAllTodos", (err) => {
    todoArr.splice(0, todoArr.length);
    mainWindow.webContents.send("backend-todo:addItem", todoArr);
  });
}

function uploadTodosToInterface() {}
