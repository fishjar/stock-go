const path = require("path");
const fs = require("fs");
const { ipcMain, dialog } = require("electron");
const fse = require("fs-extra");
const axios = require("axios");

/**
 * 监听打开文件
 */
ipcMain.on("open-file-dialog", event => {
  dialog.showOpenDialog(
    {
      title: "请选择一个文件",
      properties: ["openFile"],
      filters: [
        { name: "Swagger Files", extensions: ["yaml", "yml", "json"] },
        { name: "All Files", extensions: ["*"] },
      ],
    },
    filePaths => {
      if (filePaths) {
        event.sender.send("open-file-ok", filePaths);
      } else {
        event.sender.send("open-file-err");
      }
    }
  );
});

/**
 * 监听打开文件夹
 */
ipcMain.on("open-path-dialog", event => {
  dialog.showOpenDialog(
    {
      title: "请选择一个文件",
      properties: ["openDirectory"],
    },
    filePaths => {
      if (filePaths) {
        event.sender.send("open-path-ok", filePaths);
      } else {
        event.sender.send("open-path-err");
      }
    }
  );
});

/**
 * 监听保存文件
 */
ipcMain.on("save-file-dialog", event => {
  dialog.showSaveDialog(
    {
      title: "保存文件",
      defaultPath: "swagger.yaml",
      filters: [
        { name: "Swagger Files", extensions: ["yaml", "yml", "json"] },
        { name: "All Files", extensions: ["*"] },
      ],
    },
    filePath => {
      if (filePath) {
        event.sender.send("save-file-ok", filePath);
      } else {
        event.sender.send("save-file-err");
      }
    }
  );
});

/**
 * 监听读取文件
 */
ipcMain.on("read-file", (event, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      event.sender.send("read-file-err", err);
    } else {
      event.sender.send("read-file-ok", data);
    }
  });
});

/**
 * 监听写入文件
 */
ipcMain.on("write-file", (event, filePath, data) => {
  fs.writeFile(filePath, data, err => {
    if (err) {
      event.sender.send("write-file-err", err);
    } else {
      event.sender.send("write-file-ok");
    }
  });
});

/**
 * HTTP请求
 */
ipcMain.on(
  "api-xueqiu",
  (event, url, params = {}, method = "get", data = {}, cookie = "") => {
    axios({
      method,
      url,
      params,
      data,
      headers: {
        Cookie: cookie,
      },
    })
      .then(function(res) {
        // console.log(res);
        event.sender.send("api-xueqiu-ok", res.data);
      })
      .catch(function(err) {
        console.log(err);
        event.sender.send("api-xueqiu-err", err);
      });
  }
);
