import { defaultcCookie } from "./config";

const { ipcRenderer } = window.electron;

/**
 * 打开文件
 */
export const openFile = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("open-file-dialog");
    ipcRenderer.on("open-file-ok", (event, filePaths) => {
      resolve(filePaths[0]);
    });
    ipcRenderer.on("open-file-err", event => {
      reject(new Error("打开文件失败或已取消"));
    });
  });
};

/**
 * 打开文件夹
 */
export const openPath = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("open-path-dialog");
    ipcRenderer.on("open-path-ok", (event, filePaths) => {
      console.log(filePaths);
      resolve(filePaths[0]);
    });
    ipcRenderer.on("open-path-err", event => {
      reject(new Error("打开文件夹失败或已取消"));
    });
  });
};

/**
 * 保存文件
 */
export const saveFile = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("save-file-dialog");
    ipcRenderer.on("save-file-ok", (event, filePath) => {
      resolve(filePath);
    });
    ipcRenderer.on("save-file-err", event => {
      reject(new Error("保存文件失败或已取消"));
    });
  });
};

/**
 * 写入文件
 * @param {String} filePath
 * @param {String} data
 */
export const writeFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("write-file", filePath, data || "");
    ipcRenderer.on("write-file-ok", event => {
      resolve("写入文件成功");
    });
    ipcRenderer.on("write-file-err", (event, err) => {
      console.log(err);
      reject(new Error("写入文件错误"));
    });
  });
};

/**
 * HTTP请求
 * @param {String} method
 * @param {String} url
 */
export const requestXueqiu = (url, params, method, data) => {
  const cookie = localStorage.getItem("cookie") || defaultcCookie;
  console.log("params", params);
  console.log("cookie", cookie);

  return new Promise((resolve, reject) => {
    ipcRenderer.send("api-xueqiu", url, params, method, data, cookie);
    ipcRenderer.on("api-xueqiu-ok", (event, response) => {
      resolve(response);
    });
    ipcRenderer.on("api-xueqiu-err", (event, err) => {
      console.log(err);
      reject(new Error("xueqiu api 请求错误"));
    });
  });
};
