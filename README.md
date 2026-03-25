# Bestlight Monitor

Приложение для мониторинга данных из Google Sheets.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.4-green)](https://vuejs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-success)](https://bestlight-monitor.vercel.app/)

**Демо:** https://bestlight-monitor.vercel.app

---

## 📖 Оглавление

- [Возможности](#возможности)
- [Технологии](#технологии)
- [Быстрый старт](#быстрый-старт)
- [Настройка Google Cloud](#настройка-google-cloud)
- [Переменные окружения](#переменные-окружения)
- [Разработка](#разработка)
- [Сборка](#сборка)
- [Тесты](#тесты)
- [Деплой](#деплой)
- [Документация](#документация)
- [Структура проекта](#структура-проекта)

---

## ✨ Возможности

- 🔐 **Авторизация** — логин/пароль с SHA-256 хешированием
- 📊 **Таблица данных** — отображение данных из Google Sheets
- 🔍 **Поиск** — поиск по всем полям
- ↕️ **Сортировка** — сортировка по любой колонке
- 📄 **Пагинация** — автоматически при >200 записей
- 🔄 **Обновление** — кнопка обновления с кэшированием (5 мин)
- 📱 **Адаптивность** — работает на мобильных устройствах
- 🎨 **TypeScript** — типизированный код для надёжности

---

## 🛠 Технологии

| Категория | Технология |
|-----------|------------|
| **Framework** | Vue 3.4 |
| **Language** | TypeScript 5.3 |
| **Build** | Vite 5.2 |
| **Router** | Vue Router 4.3 |
| **Testing** | Vitest 1.4 |
| **Deployment** | Vercel |
| **API** | Google Sheets API v4 |

---

## 🚀 Быстрый старт

### Требования

- Node.js >= 18
- Yarn >= 4

### Установка

```bash
# Клонировать репозиторий
cd bestlight-monitor

# Установить зависимости
yarn install

# Настроить переменные окружения
cp .env.example .env.local
# Отредактировать .env.local

# Запустить разработку
yarn dev
```

Приложение откроется на http://localhost:5173

---

## 🔧 Настройка Google Cloud

### Шаг 1: Создать проект

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Нажмите **"Create Project"**
3. Введите название: `bestlight-monitor`
4. Нажмите **"Create"**

### Шаг 2: Включить Google Sheets API

1. В проекте перейдите в **"APIs & Services"** → **"Library"**
2. Найдите **"Google Sheets API"**
3. Нажмите **"Enable"**

### Шаг 3: Создать API Key

1. Перейдите в **"APIs & Services"** → **"Credentials"**
2. Нажмите **"+ CREATE CREDENTIALS"** → **"API key"**
3. Скопируйте полученный ключ
4. Нажмите **"Edit API key"** → **"Restrict key"**
5. В разделе **"API restrictions"**:
   - Выберите **"Restrict key"**
   - Отметьте только **"Google Sheets API"**
6. Сохраните

### Шаг 4: Настроить доступ к таблице

1. Откройте вашу Google Таблицу
2. Нажмите **"Share"** (правый верхний угол)
3. В разделе **"General access"** выберите **"Anyone with the link"**
4. Убедитесь, что стоит **"Viewer"** (только чтение)

---

## 📝 Переменные окружения

Создайте файл `.env.local`:

```bash
cp .env.example .env.local
```

Заполните переменные:

```env
# Google Sheets API Configuration
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SHEET_ID=1zeZf0sqXBCVzYZwe1UuOJXHW-Yai0TGi25sIzENX_68

# Auth Configuration
VITE_AUTH_LOGIN=admin
VITE_AUTH_PASSWORD_HASH=your_password_hash_here

# Pagination
VITE_PAGINATION_PAGE_SIZE=20
VITE_PAGINATION_THRESHOLD=200

# Cache TTL (5 minutes)
VITE_CACHE_TTL=300000
```

### Как получить SHA-256 хеш пароля

Откройте консоль браузера (F12) и выполните:

```javascript
const password = 'your_password_here';
const encoder = new TextEncoder();
const data = encoder.encode(password);
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
console.log('Password hash:', hashHex);
```

---

## 💻 Разработка

### Запуск dev-сервера

```bash
yarn dev
```

### Type check

```bash
yarn type-check
```

### Линтинг

```bash
yarn lint
```

---

## 📦 Сборка

```bash
yarn build
```

Результат в директории `dist/`:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # JS bundle (~91 KB)
│   └── index-[hash].css   # CSS bundle (~7 KB)
```

---

## ✅ Тесты

```bash
# Запустить тесты
yarn test:unit

# Запустить с покрытием
yarn test:unit --coverage
```

---

## 🌐 Деплой

### Vercel (рекомендуется)

```bash
# Установить Vercel CLI
npm i -g vercel

# Войти в аккаунт
vercel login

# Задеплоить
vercel --prod
```

### Переменные окружения в Vercel

Добавьте в **Vercel Dashboard** → **Settings** → **Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_GOOGLE_SHEETS_API_KEY` | Ваш API ключ |
| `VITE_GOOGLE_SHEET_ID` | ID таблицы |
| `VITE_AUTH_LOGIN` | Логин |
| `VITE_AUTH_PASSWORD_HASH` | Хеш пароля |

После добавления сделайте **Redeploy**.

### Другие платформы

Скопируйте содержимое `dist/` на любой статический хостинг:

- **Netlify** — перетащите папку `dist` в dashboard
- **GitHub Pages** — используйте `gh-pages` package
- **Cloudflare Pages** — подключите репозиторий
- **S3 + CloudFront** — загрузите файлы в bucket

---

## 📚 Документация

- **[GUIDE.md](./GUIDE.md)** — руководство пользователя
- **[README.md](./README.md)** — этот файл
- **[PHASE_1_2_REPORT.md](./PHASE_1_2_REPORT.md)** — отчёт о разработке

---

## 📁 Структура проекта

```
bestlight-monitor/
├── src/
│   ├── main.ts                    # Entry point
│   ├── App.vue                    # Root component
│   ├── config.ts                  # Конфигурация из env
│   ├── vite-env.d.ts              # TypeScript декларации
│   ├── router/
│   │   └── index.ts               # Vue Router
│   ├── views/
│   │   ├── LoginView.vue          # Страница входа
│   │   └── DashboardView.vue      # Таблица данных
│   ├── components/
│   │   ├── DataTable.vue          # Таблица с сортировкой
│   │   ├── SearchBar.vue          # Поиск
│   │   └── Pagination.vue         # Пагинация
│   ├── composables/
│   │   ├── useAuth.ts             # Логика авторизации
│   │   ├── useGoogleSheets.ts     # Загрузка данных
│   │   └── useUserGuid.ts         # GUID пользователя
│   ├── services/
│   │   └── google-sheets.ts       # Google Sheets API
│   ├── utils/
│   │   ├── hash.ts                # SHA-256 хеширование
│   │   └── storage.ts             # SessionStorage wrapper
│   └── assets/
│       └── main.css               # Глобальные стили
├── tests/
│   └── unit/
│       ├── hash.test.ts
│       ├── storage.test.ts
│       └── google-sheets.test.ts
├── dist/                          # Продакшен сборка
├── .env.example                   # Шаблон переменных
├── .env.local                     # Локальные переменные
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── vercel.json
```

---

## 🔒 Безопасность

- Пароль хешируется **SHA-256** перед сравнением
- Сессия хранится в **sessionStorage** (удаляется при закрытии вкладки)
- API Key ограничен только для **Google Sheets API**
- Таблица доступна только на **чтение**

---

## 📝 Changelog

### v1.0.0 (Март 2025)

- ✅ TypeScript миграция
- ✅ Интеграция с Google Sheets API
- ✅ Авторизация с SHA-256
- ✅ Поиск, сортировка, пагинация
- ✅ Деплой на Vercel
- ✅ Полная документация

---

## 📞 Контакты

По вопросам обращайтесь:
- **Email:** support@bestlight.ru
- **Телефон:** +7 (XXX) XXX-XX-XX

---

**Bestlight Monitor © 2025**
