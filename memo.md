## 開発メモ（コマンド一覧）

### 開発時

- **Next.js 開発サーバーのみ起動**

```bash
npm run dev
```

- **Electron + Next.js 同時起動（デスクトップ版を開発モードで確認）**

```bash
npm run dev:electron
```

ブラウザ版と同じ `http://localhost:3000` を表示しつつ、Electron ウィンドウでも同じ画面を確認できます。

### ビルド / 配布用

- **Next.js（レンダラー）の本番ビルドだけ実行**

```bash
npm run build:renderer
```

- **macOS アプリ（.app / .dmg）のビルド**

```bash
npm run build:mac
```

`dist-electron/` に `.app` と `.dmg` が生成されます。

### その他

- **Lint チェック**

```bash
npm run lint
```
