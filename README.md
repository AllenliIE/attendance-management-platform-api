# Attendance Management platform api

使用 Vue3 + Node.js(Express) 所建構的考勤管理系統，並運用 MYSQL 與 Sequelize 來完成資料庫的版本控管，以及使用 AWS 雲端部署。
使用者透過註冊帳號密碼來登入系統平台，同時可藉由指定按鈕、QR-Code、GPS 驗證來進行上下班打卡功能，以及瀏覽打卡記錄。
管理者經由後台提供的 QR-Code 掃描介面來提供員工打卡，亦可透過趨勢圖來確認員工出缺勤的狀況，同時提供員工帳號解鎖與更新出勤狀況的功能。

# 功能介紹

**註冊功能**

- 系統提供註冊登入功能。
- 使用者可以註冊個人的 name、email、account、password。
- 登入密碼錯誤 5 次上鎖。
- 註冊時，account、email 不能與其他人重複，若有重複會跳錯誤提示。

**種子資料**

- 使用者直接從資料庫進行初始化。
- 至少提供 5 個以上的一般使用者與 1 個管理者。

| Name  | Email             | password |
| ----- | ----------------- | -------- |
| admin | admin@example.com | 12345678 |
| user1 | user1@example.com | 12345678 |
| user2 | user2@example.com | 12345678 |
| user3 | user3@example.com | 12345678 |
| user4 | user4@example.com | 12345678 |
| user5 | user5@example.com | 12345678 |

**互動功能**

- 使用者可於個人資料頁面進行 name、email、account、password 的更新。

**考勤功能**

- 一般使用者有按鈕可以打卡。
- 上下班打卡機制(更換日為每日的 05:00(GMT+8))。
- 第一次打卡是當成上班時間。
- 當天第二次打卡當成下班時間，若多次打卡，則以最後一次打卡當成下班時間。
- 當天若只打卡一次，一樣視作出勤異常。
- 使用 QR code 功能，透過二維條碼來進行上/下班打卡。
- 使用 GPS 功能，透過指定位置附近 400m 範圍內來進行上/下班打卡。

**後台功能**

- admin 管理者有專屬的後台。
- 若使用管理帳號登入前台，或使用一般使用者帳號登入後台，等同於「帳號不存在」。
- 管理者可透過「缺勤趨勢圖」了解各月出勤狀況。
- admin 可以清除缺勤狀態，改為出勤。
- admin 可以清除上鎖狀態，改為解鎖。

# 專案安裝

1. 下載專案

```
$ git clone https://github.com/AllenliIE/attendance-management-system.git
```

2. MySQL Workbench

```
CREATE DATABASE attendance_management_platform_api_workspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. backend file

```
$ cd backend
$ npm install
$ npx sequelize db:migrate
$ npx sequelize db:seed:all
$ npm run dev

//Attendance-management-platform-api is listening on port: 3000!
```

4. frontend file

```
$ cd frontend
$ npm install
$ npm run serve

//Starting development server...
```

# 開發工具

## 共用

- dayjs 1.11.7

## 前端

- vue 3.2.13
- vue-router 4.1.6
- vuex 4.0.0
- vue-qrcode-reader 3.1.0
- bootstrap 5.2.3
- axios 1.2.1
- chart.js 4.2.1
- leaflet 1.9.3
- uuid 8.3.2
- sweetalert2 9.8.2

## 後端

- express 4.17.1
- express-session 1.17.2
- jsonwebtoken 8.5.1
- cors 2.8.5
- bcryptjs 2.4.3
- passport 0.4.1
- passport-jwt 4.0.0
- passport-local 1.0.0
- dotenv 8.2.0
- mysql2 2.1.0
- sequelize 5.21.13
- sequelize-cli 5.5.1
