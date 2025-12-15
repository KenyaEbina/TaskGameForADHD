const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  Tray,
  nativeImage,
} = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");

// パッケージングされているかどうかで dev / prod を判定
const isDev = !app.isPackaged;

/** @type {BrowserWindow | null} */
let mainWindow = null;

/** @type {http.Server | null} */
let staticServer = null;
let staticServerPort = null;

/** @type {Tray | null} */
let tray = null;

/**
 * out ディレクトリをシンプルな HTTP サーバーとして配信
 * （file:// 直読みだとルーティングが壊れるため）
 */
function startStaticServer() {
  return new Promise((resolve, reject) => {
    const outDir = path.join(__dirname, "..", "out");

    staticServer = http.createServer((req, res) => {
      const url = new URL(req.url, "http://localhost");
      const pathname = url.pathname === "/" ? "/index" : url.pathname;
      let filePath = path.join(outDir, pathname);

      let ext = path.extname(filePath);

      if (!ext) {
        // まずは Next の export が出力する /page.html 形式を探す
        const htmlCandidate = `${filePath}.html`;
        if (fs.existsSync(htmlCandidate)) {
          filePath = htmlCandidate;
          ext = ".html";
        } else {
          // なければ /page/index.html 形式を試す
          filePath = path.join(filePath, "index.html");
          ext = ".html";
        }
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end("Not Found");
          return;
        }

        // 簡易的な Content-Type 判定
        const contentTypeMap = {
          ".html": "text/html; charset=utf-8",
          ".js": "text/javascript; charset=utf-8",
          ".css": "text/css; charset=utf-8",
          ".json": "application/json; charset=utf-8",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".svg": "image/svg+xml",
        };
        const contentType =
          contentTypeMap[path.extname(filePath)] || "application/octet-stream";
        res.setHeader("Content-Type", contentType);
        res.end(data);
      });
    });

    staticServer.listen(0, () => {
      const address = staticServer.address();
      if (address && typeof address.port === "number") {
        staticServerPort = address.port;
        resolve(staticServerPort);
      } else {
        reject(new Error("Failed to start static server"));
      }
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    backgroundColor: "#ffffff",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    // 開発中は Next.js の dev サーバーに接続
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    // 本番は out ディレクトリを静的サーバーで配信し、それをブラウザから見る
    const url = `http://127.0.0.1:${staticServerPort}`;
    mainWindow.loadURL(url);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  if (!isDev) {
    await startStaticServer();
  }

  // macOS メニューバー用のトレイアイコン（残り時間表示）
  if (!tray && process.platform === "darwin") {
    const emptyIcon = nativeImage.createEmpty();
    tray = new Tray(emptyIcon);
    tray.setTitle("READY");
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // macOS ではウィンドウをすべて閉じてもアプリは終了しないのが一般的
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (staticServer) {
    staticServer.close();
    staticServer = null;
  }

  if (tray) {
    tray.destroy();
    tray = null;
  }
});

// タイマーの残り時間をメニューバーに表示
ipcMain.on("timer:update-remaining", (_event, seconds) => {
  if (!tray || typeof seconds !== "number") return;

  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (safeSeconds % 60).toString().padStart(2, "0");

  tray.setTitle(`${mins}:${secs}`);
});

// タイムアップ時の通知
ipcMain.on("timer:notify-finished", (_event, payload) => {
  const { title, body } = payload || {};

  if (!Notification.isSupported()) return;

  new Notification({
    title: title || "TIME UP",
    body: body || "Time limit reached.",
  }).show();
});
