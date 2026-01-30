# MuseBox - 靈感卡片盒

一個互動式的靈感管理工具，讓您可以建立多個主題卡片盒，並透過抽卡動畫獲得隨機靈感。支援本機檔案同步與備份。

## 功能特色

*   🗃️ **多重卡片盒管理**：自訂不同主題的靈感庫。
*   🎲 **互動式抽卡**：精美的 3D 翻轉動畫與隨機抽取機制。
*   🤖 **AI 靈感助手**：整合 Google Gemini AI，自動發想相關靈感。
*   💾 **本機同步**：支援 File System Access API，可直接存取電腦硬碟上的 JSON 檔案。
*   📱 **響應式設計**：支援桌面與平板操作。

---

## 💻 開發與執行 (Development)

本專案使用 React + Vite + Electron。

1.  **安裝依賴**
    ```bash
    npm install
    ```

2.  **啟動開發模式** (網頁版 + 桌面版預覽)
    ```bash
    npm run electron:start
    ```

---

## 📦 如何打包成 Windows 安裝檔 (.exe)

本專案已設定好 Electron Builder，可以一鍵產出 Windows 安裝程式。

### 步驟 1：確保環境準備就緒
請確認您已安裝 [Node.js](https://nodejs.org/) (建議版本 v18 或以上)。

### 步驟 2：安裝相依套件
如果您還沒安裝過，請在專案根目錄執行：
```bash
npm install
```

### 步驟 3：開始打包
執行以下指令開始建置與封裝：
```bash
npm run electron:pack
```

### 步驟 4：取得安裝檔
打包完成後，請前往專案資料夾下的 **`dist-electron`** 目錄。
您會看到類似 **`MuseBox Setup 1.0.0.exe`** 的檔案。

您可以直接將此檔案分享給其他人，或安裝到自己的電腦上。

---

## 📝 關於 API Key

由於此應用程式包含 Gemini AI 功能，如果您打包給他人使用，請確保使用者環境中有設置 API Key，或者您可以在代碼中自行處理 Key 的輸入方式（注意：請勿將 API Key 直接寫死在開源代碼中）。

在開發環境中，應用程式會讀取 `process.env.API_KEY`。