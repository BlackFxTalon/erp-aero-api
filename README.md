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