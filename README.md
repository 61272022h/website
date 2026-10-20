# 放學以後：時間屬於誰？

一場以台灣家庭教育支出與學生課後時間為題的 SDGs 數位策展原型。主要對應 SDG 4.5，從「放學後，你有多少選擇？」帶觀眾閱讀家戶支出與歷史學生調查，並辨認證據能支持到哪裡。

## 專案狀態

目前已完成單展區響應式原型，包含可點選查看詳情的五等分位家戶教育服務支出圖、2001 年 TEPS 課後安排歷史切片，以及資料解讀互動。GitHub Repo remote 尚未設定，尚無可用的 Pages 網址。

原型刻意將 2024 年全體家戶支出與 2001 年學生調查分開呈現；兩者不構成教育機會差距擴大的證明。觀展回饋表單與 Google Apps Script 尚未啟用。

## 技術規劃

- Vite 靜態建置，輸出至 `dist/`
- GSAP 與 ScrollTrigger 作為展場動態與捲動互動工具
- Google Apps Script Web App 將觀展回饋寫入 Google 試算表；Apps Script 會在瀏覽器中直接設定，不使用 Clasp
- GitHub Actions 建置並發佈至 GitHub Pages

## 開發環境

需要 Node.js 24 與 npm。安裝依賴並啟動本機預覽：

```sh
npm ci
npm run dev
```

Production 建置：

```sh
npm run build
```

## GitHub Pages

建立並設定 GitHub Repo 後，請在 Repo 的 **Settings → Pages** 將發佈來源設為 **GitHub Actions**。網站來源檔加入後，`main` 分支上的相關變更會觸發部署。

**網站網址：** 首次部署成功並確認可用後補上。
