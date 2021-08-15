## AC TA Tool Helper

This is a Chrome extension that supports TA's work.

<img width="514" alt="Screenshot 2021-08-09 at 08 09 16" src="https://user-images.githubusercontent.com/10878489/128650076-db573468-f3de-42e2-8af0-cf1678243e07.png">

## Features

1. Submit time now: 打開新分頁，前往時數表頁面
2. Show accumulated TA working time: 加總時數表當前時數（只在時數表頁面有效）
3. Can switch whether to display only unresolved course tabs: 可切換是否僅顯示尚未完成的合作項目（只在作業總覽頁面有效）
4. Retrieve cached input: 呈現近期輸入的內容在新視窗當中。複製貼上至 Lighthouse editor 即可獲得原有內容與排版
5. Shortcut for inserting rank and tagging student: 回覆區域新增捷徑按鈕，點擊後自動填入批改等第與標記學生

## How to use

1. Clone (or download) this repo
2. Go to `chrome://extensions` in Chrome
3. Click `Load unpacked` and upload `dist` folder
4. You can find "AC TA Tool Helper" when right clicking the page

## Development Setup
```
# watch and auto re-build dist folder
$ npm run dev

# build dist folder in production
$ npm run build

# run eslint to check file under the src folder
$ npm run lint
```

## Project Structure
- `dist`: contains built files for distribution.

- `public`: contains the files that you don’t want to process through webpack. For example manifest and images.

- `src`: contains the source code.

- `webpack`: contains webpack configuration.