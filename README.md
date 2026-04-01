# ERP.AERO REST API

REST API сервис с JWT авторизацией и управлением файлами.

## Стек

- **Node.js** + **Express.js**
- **MySQL** (через XAMPP)
- **JWT** — авторизация (access токен 10 минут + refresh токен)
- **Multer** — загрузка файлов

## Требования

- Node.js v18+
- XAMPP с запущенным MySQL

---

## Запуск проекта

### 1. Клонируй репозиторий

```bash
git clone <url>
cd erp-aero-api
```

### 2. Установи зависимости

```bash
npm install
```

### 3. Создай файл `.env` в корне проекта

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=erp_aero

JWT_SECRET=your_very_long_secret_key_minimum_32_chars
JWT_EXPIRES_IN=10m
REFRESH_TOKEN_EXPIRES_IN=7d
```

> `DB_PASSWORD` оставь пустым — у XAMPP по умолчанию нет пароля для root.

### 4. Запусти MySQL через XAMPP

- Открой **XAMPP Control Panel**
- Нажми **Start** напротив **MySQL**
- Убедись что статус зелёный (порт 3306)

### 5. Создай базу данных

- Открой `http://localhost/phpmyadmin`
- Нажми **New** → назови `erp_aero` → **Create**

### 6. Выполни миграции

```bash
npm run migrate
```

Ожидаемый вывод:
```
✅ Таблица users готова
✅ Таблица refresh_tokens готова
✅ Таблица files готова
🎉 Миграции выполнены успешно
```

### 7. Создай папку для файлов

```bash
mkdir uploads
```

### 8. Запусти сервер

```bash
# Режим разработки (с авто-перезапуском)
npm run dev

# Продакшен
npm start
```

Сервер запустится на `http://localhost:3000`

---

## API

### Авторизация

| Метод | Роут | Описание | Защищён |
|---|---|---|---|
| POST | `/signup` | Регистрация | Нет |
| POST | `/signin` | Вход, получение токенов | Нет |
| POST | `/signin/new_token` | Обновление токенов по refresh токену | Нет |
| GET | `/info` | ID текущего пользователя | Да |
| GET | `/logout` | Выход, отзыв токена | Да |

### Файлы

| Метод | Роут | Описание | Защищён |
|---|---|---|---|
| POST | `/file/upload` | Загрузка файла | Да |
| GET | `/file/list` | Список файлов с пагинацией | Да |
| GET | `/file/:id` | Информация о файле | Да |
| GET | `/file/download/:id` | Скачать файл | Да |
| PUT | `/file/update/:id` | Заменить файл | Да |
| DELETE | `/file/delete/:id` | Удалить файл | Да |

---

## Примеры запросов

### Регистрация

```http
POST /signup
Content-Type: application/json

{
  "id": "test@email.com",
  "password": "secret123"
}
```

Ответ:
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "f47ac10b-..."
}
```

### Вход

```http
POST /signin
Content-Type: application/json

{
  "id": "test@email.com",
  "password": "secret123"
}
```

### Защищённые роуты

Все защищённые роуты требуют заголовок:

```
Authorization: Bearer <accessToken>
```

### Загрузка файла

```http
POST /file/upload
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

file: <файл>
```

### Список файлов с пагинацией

```http
GET /file/list?page=1&list_size=10
Authorization: Bearer <accessToken>
```

### Обновление токена

```http
POST /signin/new_token
Content-Type: application/json

{
  "refreshToken": "f47ac10b-..."
}
```

### Выход

```http
GET /logout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "refreshToken": "f47ac10b-..."
}
```

---

## Структура проекта

```
erp-aero-api/
├── src/
│   ├── config/
│   │   ├── db.js           # подключение к MySQL
│   │   ├── migrate.js      # создание таблиц
│   │   └── multer.js       # настройка загрузки файлов
│   ├── controllers/
│   │   ├── authController.js
│   │   └── fileController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── tokenModel.js
│   │   └── fileModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── fileRoutes.js
│   ├── utils/
│   │   └── jwt.js
│   └── app.js
├── uploads/                # загруженные файлы
├── .env                    # переменные окружения (не коммитить!)
├── .gitignore
└── package.json
```

---

## Скрипты

```bash
npm run dev      # запуск в режиме разработки (nodemon)
npm start        # запуск в продакшене
npm run migrate  # создание таблиц в БД
```

---

# English Version

## ERP.AERO REST API

REST API service with JWT authentication and file management.

## Stack

- **Node.js** + **Express.js**
- **MySQL** (via XAMPP)
- **JWT** - authentication (access token 10 minutes + refresh token)
- **Multer** - file uploads

## Requirements

- Node.js v18+
- XAMPP with MySQL running

---

## Project Setup

### 1. Clone the repository

```bash
git clone <url>
cd erp-aero-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file in the project root

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=erp_aero

JWT_SECRET=your_very_long_secret_key_minimum_32_chars
JWT_EXPIRES_IN=10m
REFRESH_TOKEN_EXPIRES_IN=7d
```

> Leave `DB_PASSWORD` empty - XAMPP uses an empty password for `root` by default.

### 4. Start MySQL through XAMPP

- Open the **XAMPP Control Panel**
- Click **Start** next to **MySQL**
- Make sure the status turns green (port 3306)

### 5. Create the database

- Open `http://localhost/phpmyadmin`
- Click **New** -> name it `erp_aero` -> **Create**

### 6. Run migrations

```bash
npm run migrate
```

Expected output:
```text
✅ Table users is ready
✅ Table refresh_tokens is ready
✅ Table files is ready
🎉 Migrations completed successfully
```

### 7. Create the uploads folder

```bash
mkdir uploads
```

### 8. Start the server

```bash
# Development mode (with auto-reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:3000`

---

## API

### Authentication

| Method | Route | Description | Protected |
|---|---|---|---|
| POST | `/signup` | Registration | No |
| POST | `/signin` | Sign in, get tokens | No |
| POST | `/signin/new_token` | Refresh tokens using refresh token | No |
| GET | `/info` | Current user ID | Yes |
| GET | `/logout` | Logout, revoke token | Yes |

### Files

| Method | Route | Description | Protected |
|---|---|---|---|
| POST | `/file/upload` | Upload a file | Yes |
| GET | `/file/list` | File list with pagination | Yes |
| GET | `/file/:id` | File information | Yes |
| GET | `/file/download/:id` | Download a file | Yes |
| PUT | `/file/update/:id` | Replace a file | Yes |
| DELETE | `/file/delete/:id` | Delete a file | Yes |

---

## Request Examples

### Registration

```http
POST /signup
Content-Type: application/json

{
  "id": "test@email.com",
  "password": "secret123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "f47ac10b-..."
}
```

### Sign In

```http
POST /signin
Content-Type: application/json

{
  "id": "test@email.com",
  "password": "secret123"
}
```

### Protected Routes

All protected routes require the following header:

```text
Authorization: Bearer <accessToken>
```

### File Upload

```http
POST /file/upload
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

file: <file>
```

### File List with Pagination

```http
GET /file/list?page=1&list_size=10
Authorization: Bearer <accessToken>
```

### Refresh Token

```http
POST /signin/new_token
Content-Type: application/json

{
  "refreshToken": "f47ac10b-..."
}
```

### Logout

```http
GET /logout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "refreshToken": "f47ac10b-..."
}
```

---

## Project Structure

```
erp-aero-api/
├── src/
│   ├── config/
│   │   ├── db.js           # MySQL connection
│   │   ├── migrate.js      # table creation
│   │   └── multer.js       # file upload configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   └── fileController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── tokenModel.js
│   │   └── fileModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── fileRoutes.js
│   ├── utils/
│   │   └── jwt.js
│   └── app.js
├── uploads/                # uploaded files
├── .env                    # environment variables (do not commit!)
├── .gitignore
└── package.json
```

---

## Scripts

```bash
npm run dev      # start in development mode (nodemon)
npm start        # start in production
npm run migrate  # create tables in the database
```
