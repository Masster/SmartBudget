# DollarWise — Анализ продукта и Техническое задание

---

## ЧАСТЬ 1: АНАЛИЗ ПРОДУКТА

### 1.1 Что такое DollarWise

DollarWise — мобильное приложение для управления личными финансами, созданное Калебом Хаммером (Caleb Hammer), финансовым блогером и ведущим YouTube-шоу «Financial Audit» (2M+ подписчиков). Приложение доступно на iOS и Android, насчитывает более 279 000 регистраций. Текущая версия — 6.0, работает только с финансовыми институтами США.

### 1.2 Продуктовые решения

**Ядро продукта — «Safe to Spend» (Безопасно потратить).** При открытии приложения пользователь видит одно число — сколько денег он может потратить прямо сейчас, не нарушая свой бюджет. Это принципиальное отличие от конкурентов, которые показывают графики, таблицы и категории, заставляя пользователя самого считать. DollarWise даёт ответ сразу.

**Система бюджетирования 50/30/20:**
- 50% дохода → Needs (необходимое): жильё, еда, транспорт
- 30% дохода → Wants (желания): развлечения, подписки, рестораны
- 20% дохода → Debt/Savings (долги и сбережения)

Приложение автоматически строит бюджет вокруг этих трёх категорий. Внутри них — всего 12 подкатегорий (вместо 50+ у конкурентов), что снижает когнитивную нагрузку.

**Swipe-интерфейс для категоризации.** Транзакции просматриваются свайпом (по аналогии с Tinder): влево — Needs, вправо — Wants, вверх — Debt/Savings. Это превращает рутинный процесс в быстрое, почти игровое действие.

**Автоматическая синхронизация через Plaid.** Подключение банковских счетов и кредитных карт через Plaid API. Транзакции подтягиваются автоматически, без ручного ввода.

**AI-инсайты.** Приложение анализирует паттерны трат и генерирует персонализированные рекомендации — без агрессивных уведомлений и «красных флагов», а в формате мягких подсказок.

**Обнаружение забытых подписок.** Сканирование регулярных списаний для выявления подписок, о которых пользователь забыл.

**Привязка к зарплатному циклу.** Бюджет строится не по календарным месяцам, а по датам зарплаты, что ближе к реальному финансовому поведению.

### 1.3 Дизайн и UX

Философия дизайна DollarWise — «бюджетирование для тех, кто ненавидит бюджетирование» (The Easy Budgeting App for People Who Hate Budgeting). Ключевые характеристики:

- **Минимализм.** Нет сложных меню, дашбордов с десятками виджетов. Главный экран — одно число (Safe to Spend) и свайп-лента транзакций.
- **Эмоциональный тон.** Интерфейс не стыдит пользователя. Нет красных предупреждений, вместо этого — спокойные, поддерживающие формулировки.
- **Скорость взаимодействия.** Swipe-categorization позволяет обработать десятки транзакций за минуту.
- **Онбординг.** Быстрый старт: подключение счёта → автоматический бюджет → сразу виден Safe to Spend.

### 1.4 Что нравится пользователям

На основе отзывов (рейтинг iOS: 4.0 из 5, 3100+ отзывов):

- **Простота.** «DollarWise — первое приложение, которое действительно меня понимает. Я наконец чувствую, что двигаюсь вперёд, а не просто отслеживаю прошлое.»
- **Отсутствие ручного ввода.** «Я пробовал все бюджетные приложения, но всегда бросал, потому что ручной ввод — это как вторая работа. DollarWise — game changer, он буквально делает работу за меня.»
- **Прозрачность.** «Я нормально зарабатываю, но никогда не знал, куда уходят деньги. DollarWise дал мне ясность, не заставляя чувствовать себя глупо.»
- **Быстрый результат.** «Нашёл три забытые подписки за первые десять минут.»

**Основные жалобы:**
- Баги при создании аккаунта и верификации email
- Слабая автокатегоризация транзакций (требуется ручная)
- Отсутствие отчётов, графиков, отслеживания чистого капитала, календаря
- Высокая цена ($9.99/мес) при ограниченном функционале
- Проблемы с Plaid-интеграцией (отваливаются привязанные аккаунты)
- Android-версия значительно хуже iOS (рейтинг ~1.6 vs 4.0)

### 1.5 Сравнение с конкурентами

| Параметр | DollarWise | YNAB | Monarch Money | Copilot |
|---|---|---|---|---|
| Цена/мес | $9.99 | $14.99 ($9.08 annual) | $14.99 ($8.33 annual) | $13 ($7.92 annual) |
| Метод | 50/30/20 | Zero-based | Flexible | AI-tracking |
| Автосинхронизация | Да (Plaid) | Да | Да | Да |
| AI-инсайты | Да | Нет | Частично | Да |
| Платформы | iOS + Android | iOS + Android + Web | iOS + Android + Web | Только Apple |
| Кривая обучения | Очень низкая | Высокая | Средняя | Низкая |
| Совместный доступ | Нет | Да | Да | Да |
| Web-версия | Нет | Да | Да | Нет |
| Net Worth | Нет | Да | Да | Да |
| Сила | Простота, Safe to Spend | Дисциплина, контроль | Полнота, замена Mint | Дизайн iOS |

**Ключевое отличие DollarWise:** ультра-простота + единственная метрика «Safe to Spend» + influencer-аудитория Caleb Hammer. Это приложение для тех, кому нужен быстрый результат без погружения в финансовую грамотность. YNAB — для дисциплинированных, Monarch — для тех, кому нужен полный контроль, Copilot — для фанатов Apple-экосистемы.

---

## ЧАСТЬ 2: ОПИСАНИЕ ДЛЯ ИНВЕСТОРА

### Проблема

73% американцев живут от зарплаты до зарплаты. Существующие бюджетные приложения (YNAB, Monarch) требуют финансовой грамотности, времени и дисциплины. После закрытия Mint (январь 2024) рынок лишился единственного массового бесплатного решения. Потенциальные пользователи — люди, которые знают, что у них проблемы с деньгами, но не хотят (и не могут) тратить часы на бюджетирование.

### Решение

DollarWise — бюджетное приложение с единственной метрикой: «Сколько я могу безопасно потратить прямо сейчас?». Вместо таблиц и графиков — одно число на главном экране. Вместо ручного ввода — автоматическая синхронизация с банком. Вместо десятков категорий — три (Needs / Wants / Savings), категоризация свайпом за секунды. AI анализирует паттерны и предлагает улучшения.

### Рынок

- TAM (глобальный рынок PFM-приложений): $1.57B (2025), прогноз $5.4B к 2032, CAGR ~18%
- SAM (англоязычные рынки): ~$600M
- SOM (текущий доступный — только США): 279 000 пользователей, потенциал 10M+ при расширении на post-Mint аудиторию

### Бизнес-модель

- Freemium → подписка $9.99/мес (после 3-дневного триала)
- Lifetime Access — разовая покупка (продвигается через аудиторию создателя)
- Партнёрская программа (affiliate)
- Потенциал: B2B-лицензирование для работодателей (financial wellness programs)

### Конкурентное преимущество

1. **Influencer Distribution.** Caleb Hammer — 2M+ подписчиков YouTube. Органический трафик без CAC.
2. **Простота как продуктовая стратегия.** Не «ещё одно приложение с графиками», а «антибюджет для ленивых». Низкий churn за счёт минимальных требований к пользователю.
3. **AI-first.** Персонализированные инсайты вместо статических правил.
4. **Post-Mint vacuum.** 3.6M пользователей Mint ищут замену. DollarWise — самый простой вариант миграции.

### Риски

- Зависимость от одного influencer-канала дистрибуции
- Android-версия отстаёт по качеству
- Ограничение US-only (зависимость от Plaid)
- Высокая конкуренция: YNAB, Monarch, Copilot активно растут

### Метрики (публичные)

- 279 000+ регистраций
- iOS рейтинг: 4.0/5 (3100+ отзывов)
- Версия 6.0 — активная разработка

---

## ЧАСТЬ 3: ТЕХНИЧЕСКОЕ ЗАДАНИЕ (ТЗ) для Claude Code

### Цель проекта

Создать web-приложение для управления личными финансами, вдохновлённое DollarWise, с архитектурой, готовой к масштабированию на многопользовательский режим.

### Название рабочее: SmartBudget

---

### 3.1 Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│  Next.js 14+ (App Router) + TypeScript + Tailwind CSS   │
│  React Query для серверного состояния                    │
│  Zustand для клиентского состояния                       │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API / tRPC
┌──────────────────────┴──────────────────────────────────┐
│                      BACKEND                             │
│  Next.js API Routes (или отдельный Express/Fastify)     │
│  Prisma ORM                                              │
│  NextAuth.js (подготовка к мультиюзер)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│                     DATABASE                             │
│  PostgreSQL (через Prisma)                               │
│  Структура: users → accounts → transactions → budgets    │
└─────────────────────────────────────────────────────────┘
```

**Почему такая архитектура:**
- Next.js = один проект для фронтенда и API, быстрый старт
- Prisma = type-safe ORM, миграции из коробки, простое добавление новых моделей
- NextAuth.js = подготовка к авторизации (OAuth, email, credentials) без переписывания
- PostgreSQL = надёжная, масштабируемая база, поддержка JSON-полей для гибких настроек
- Zustand + React Query = разделение серверного и клиентского состояния

---

### 3.2 Модель данных (Prisma Schema)

```prisma
// ========== ПОЛЬЗОВАТЕЛИ ==========
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String?              // null для OAuth
  avatarUrl     String?
  currency      String    @default("USD")
  paydayDate    Int       @default(1)  // день зарплаты (1-31)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  categories    Category[]
  budgets       Budget[]
  settings      UserSettings?
  sessions      Session[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model UserSettings {
  id              String  @id @default(cuid())
  userId          String  @unique
  budgetMethod    String  @default("50_30_20")  // 50_30_20 | zero_based | custom
  needsPercent    Int     @default(50)
  wantsPercent    Int     @default(30)
  savingsPercent  Int     @default(20)
  notificationsOn Boolean @default(true)
  weekStartDay    Int     @default(1)  // 0=Sun, 1=Mon
  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ========== СЧЕТА ==========
model Account {
  id           String        @id @default(cuid())
  userId       String
  name         String        // "Тинькофф", "Сбер", "Наличные"
  type         AccountType   // CHECKING, SAVINGS, CREDIT, CASH
  balance      Decimal       @default(0)
  currency     String        @default("USD")
  icon         String?
  color        String?
  isActive     Boolean       @default(true)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
}

enum AccountType {
  CHECKING
  SAVINGS
  CREDIT
  CASH
  INVESTMENT
}

// ========== КАТЕГОРИИ ==========
model Category {
  id           String       @id @default(cuid())
  userId       String
  name         String       // "Продукты", "Аренда", "Netflix"
  icon         String       // emoji или иконка
  color        String       // HEX
  budgetGroup  BudgetGroup  // NEEDS, WANTS, SAVINGS
  isSystem     Boolean      @default(false)  // системные нельзя удалить
  sortOrder    Int          @default(0)
  createdAt    DateTime     @default(now())

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
}

enum BudgetGroup {
  NEEDS
  WANTS
  SAVINGS
}

// ========== ТРАНЗАКЦИИ ==========
model Transaction {
  id           String          @id @default(cuid())
  userId       String
  accountId    String
  categoryId   String?
  amount       Decimal         // отрицательное = расход, положительное = доход
  description  String
  date         DateTime
  type         TransactionType
  isRecurring  Boolean         @default(false)
  recurringId  String?         // связь с шаблоном повторяющейся транзакции
  status       SwipeStatus     @default(UNCATEGORIZED)
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  account      Account         @relation(fields: [accountId], references: [id], onDelete: Cascade)
  category     Category?       @relation(fields: [categoryId], references: [id])
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}

enum SwipeStatus {
  UNCATEGORIZED
  CATEGORIZED
  SKIPPED
}

// ========== БЮДЖЕТЫ ==========
model Budget {
  id           String      @id @default(cuid())
  userId       String
  month        Int         // 1-12
  year         Int
  totalIncome  Decimal     @default(0)
  needsLimit   Decimal     @default(0)
  wantsLimit   Decimal     @default(0)
  savingsLimit Decimal     @default(0)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, month, year])
}

// ========== ПОВТОРЯЮЩИЕСЯ ПЛАТЕЖИ ==========
model RecurringTransaction {
  id          String    @id @default(cuid())
  userId      String
  description String
  amount      Decimal
  categoryId  String?
  frequency   String    // WEEKLY, BIWEEKLY, MONTHLY, YEARLY
  nextDate    DateTime
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
}
```

---

### 3.3 Экраны и функциональность

#### ЭКРАН 1: Dashboard (Главный экран)

**Центральный элемент — «Safe to Spend»:**
```
Формула: Safe to Spend = Текущий баланс всех счетов
         − Оставшиеся обязательные расходы до конца периода (Needs)
         − Плановые платежи по долгам/сбережениям (Savings)
         = Сумма, которую можно потратить на Wants
```

Компоненты экрана:
- Большое число Safe to Spend в центре (зелёное если >20% бюджета, жёлтое если <20%, красное если <0)
- Прогресс-бары: Needs / Wants / Savings (потрачено / лимит)
- Кнопка «+ Добавить транзакцию»
- Лента последних 5 транзакций
- Мини-карточки счетов с балансами

#### ЭКРАН 2: Swipe-категоризация транзакций

Полноэкранная карточка транзакции:
- Сумма, описание, дата, счёт
- Свайп влево → NEEDS (синий)
- Свайп вправо → WANTS (оранжевый)
- Свайп вверх → SAVINGS/DEBT (зелёный)
- Тап на карточку → выбор конкретной подкатегории
- Счётчик «осталось X некатегоризированных»

Библиотека для свайпов: `framer-motion` или `react-spring` с gesture handling.

#### ЭКРАН 3: Транзакции (список)

- Полный список с фильтрами: по дате, категории, счёту, типу
- Поиск по описанию
- Группировка по дням
- Итоги за период (доходы / расходы / баланс)
- Inline-редактирование категории
- Добавление / редактирование / удаление транзакции

#### ЭКРАН 4: Бюджет

- Визуализация 50/30/20:
  - Три секции с прогресс-барами
  - Внутри каждой — подкатегории с их долей
  - Реальные траты vs план
- Редактирование процентов (кастомное соотношение вместо 50/30/20)
- Привязка к зарплатному циклу: бюджет рассчитывается от paydayDate до следующего paydayDate
- История бюджетов по месяцам

#### ЭКРАН 5: Счета

- Список всех счетов с балансами
- Добавление / редактирование / архивация счёта
- Общий баланс (сумма всех активных)
- Иконки и цвета для визуального различения
- Ручное обновление баланса (для MVP без банковской интеграции)

#### ЭКРАН 6: Аналитика

- Расходы по категориям (donut chart)
- Динамика расходов за 3/6/12 месяцев (line chart)
- Сравнение месяц к месяцу
- Топ-5 категорий расходов
- Обнаружение повторяющихся платежей (подписки)
- Библиотека графиков: Recharts

#### ЭКРАН 7: Настройки

- Профиль (имя, email, аватар)
- Валюта по умолчанию
- День зарплаты
- Метод бюджетирования (50/30/20 / custom)
- Управление категориями (добавление, редактирование, удаление)
- Экспорт данных (CSV)
- Тема (light / dark)

---

### 3.4 API Endpoints

```
AUTH (подготовка к мультиюзер):
POST   /api/auth/register     — регистрация
POST   /api/auth/login         — вход
POST   /api/auth/logout        — выход
GET    /api/auth/me            — текущий пользователь

ACCOUNTS:
GET    /api/accounts           — список счетов
POST   /api/accounts           — создать счёт
PATCH  /api/accounts/:id       — обновить счёт
DELETE /api/accounts/:id       — удалить счёт

TRANSACTIONS:
GET    /api/transactions       — список (с пагинацией, фильтрами)
POST   /api/transactions       — создать
PATCH  /api/transactions/:id   — обновить (включая swipe-категоризацию)
DELETE /api/transactions/:id   — удалить
GET    /api/transactions/uncategorized — некатегоризированные для свайпа
POST   /api/transactions/bulk-categorize — массовая категоризация

CATEGORIES:
GET    /api/categories         — список категорий
POST   /api/categories         — создать
PATCH  /api/categories/:id     — обновить
DELETE /api/categories/:id     — удалить

BUDGETS:
GET    /api/budgets/current    — текущий бюджет
GET    /api/budgets/:year/:month — бюджет за период
POST   /api/budgets            — создать/обновить бюджет
GET    /api/budgets/safe-to-spend — расчёт Safe to Spend

ANALYTICS:
GET    /api/analytics/spending-by-category?period=month
GET    /api/analytics/spending-trend?months=6
GET    /api/analytics/recurring-payments
GET    /api/analytics/month-comparison

SETTINGS:
GET    /api/settings           — настройки пользователя
PATCH  /api/settings           — обновить настройки
```

---

### 3.5 Стек технологий

| Слой | Технология | Обоснование |
|---|---|---|
| Frontend framework | Next.js 14+ (App Router) | SSR, API routes в одном проекте, быстрый старт |
| Язык | TypeScript | Type safety, автодополнение, меньше багов |
| UI | Tailwind CSS + shadcn/ui | Быстрая вёрстка, консистентные компоненты |
| Анимации | Framer Motion | Swipe-жесты, transitions |
| Графики | Recharts | React-нативные, лёгкие |
| Состояние (клиент) | Zustand | Минималистичный, без boilerplate |
| Состояние (сервер) | TanStack React Query | Кэширование, синхронизация, optimistic updates |
| ORM | Prisma | Type-safe запросы, миграции |
| База данных | PostgreSQL | Надёжность, JSON-поля, масштабируемость |
| Аутентификация | NextAuth.js v5 | OAuth-ready, sessions, JWT |
| Валидация | Zod | Runtime-валидация, интеграция с TypeScript |
| Тестирование | Vitest + Playwright | Unit + E2E |

---

### 3.6 Архитектура для масштабирования на мультиюзер

Приложение с первого дня проектируется как многопользовательское:

**1. Все данные привязаны к userId.** Каждая таблица (accounts, transactions, categories, budgets) содержит userId. Все запросы фильтруются по текущему пользователю.

**2. Middleware авторизации.** Каждый API endpoint проходит через middleware, который:
- Проверяет наличие сессии/токена
- Извлекает userId
- Передаёт его в обработчик

```typescript
// middleware/auth.ts
export async function withAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session.user.id;
}
```

**3. Для MVP (однопользовательский режим):**
- Автоматически создаётся один пользователь при первом запуске
- Все запросы используют этот userId
- Нет экрана логина (bypass auth)
- Переключение на полную авторизацию — один флаг в конфиге:

```typescript
// config.ts
export const config = {
  MULTI_USER: process.env.MULTI_USER === "true", // false для MVP
};
```

**4. Подготовка к расширению:**
- Row Level Security (RLS) на уровне PostgreSQL как дополнительный слой защиты
- Структура позволяет добавить «семейный доступ» (shared budgets) через таблицу-связку UserGroup
- Refresh tokens + access tokens для безопасной аутентификации

---

### 3.7 Seed Data (начальные данные)

При первом запуске создаются:

**12 системных категорий:**

| Группа | Категории |
|---|---|
| NEEDS | Жильё, Продукты, Транспорт, Здоровье, Коммунальные |
| WANTS | Рестораны, Развлечения, Шоппинг, Подписки |
| SAVINGS | Сбережения, Погашение долга, Инвестиции |

**Демо-данные (опционально):**
- 2 счёта (основной + наличные)
- 30 дней транзакций для демонстрации функционала
- Предзаполненный бюджет текущего месяца

---

### 3.8 Структура файлов проекта

```
smartbudget/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── globals.css
│   │   ├── swipe/page.tsx              # Swipe-категоризация
│   │   ├── transactions/page.tsx       # Список транзакций
│   │   ├── budget/page.tsx             # Бюджет
│   │   ├── accounts/page.tsx           # Счета
│   │   ├── analytics/page.tsx          # Аналитика
│   │   ├── settings/page.tsx           # Настройки
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── accounts/route.ts
│   │       ├── transactions/route.ts
│   │       ├── categories/route.ts
│   │       ├── budgets/route.ts
│   │       ├── analytics/route.ts
│   │       └── settings/route.ts
│   ├── components/
│   │   ├── ui/                         # shadcn/ui компоненты
│   │   ├── SafeToSpend.tsx
│   │   ├── SwipeCard.tsx
│   │   ├── TransactionList.tsx
│   │   ├── BudgetProgressBar.tsx
│   │   ├── CategoryPicker.tsx
│   │   ├── AccountCard.tsx
│   │   ├── SpendingChart.tsx
│   │   ├── AddTransactionModal.tsx
│   │   └── Navigation.tsx
│   ├── lib/
│   │   ├── prisma.ts                   # Prisma client singleton
│   │   ├── auth.ts                     # NextAuth config
│   │   ├── safe-to-spend.ts            # Расчёт Safe to Spend
│   │   ├── budget-calculator.ts        # Логика бюджетов
│   │   └── validators.ts               # Zod schemas
│   ├── hooks/
│   │   ├── useTransactions.ts
│   │   ├── useBudget.ts
│   │   ├── useAccounts.ts
│   │   └── useSafeToSpend.ts
│   ├── stores/
│   │   └── app-store.ts                # Zustand store
│   └── types/
│       └── index.ts
├── public/
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

### 3.9 Порядок реализации (Roadmap для Claude Code)

**Фаза 1 — Скелет (день 1):**
1. Инициализация Next.js + TypeScript + Tailwind + shadcn/ui
2. Настройка Prisma + PostgreSQL + schema + миграции
3. Seed: создание пользователя + системных категорий
4. Базовый layout с навигацией (sidebar)
5. Простой auth middleware (однопользовательский)

**Фаза 2 — Ядро (дни 2-3):**
6. CRUD счетов (API + UI)
7. CRUD транзакций (API + UI со списком и фильтрами)
8. CRUD категорий
9. Добавление транзакции (модальное окно с формой)

**Фаза 3 — Ключевые фичи (дни 4-5):**
10. Swipe-категоризация (Framer Motion карточки)
11. Расчёт и отображение Safe to Spend
12. Бюджет: 50/30/20 с прогресс-барами
13. Привязка к зарплатному циклу

**Фаза 4 — Аналитика (день 6):**
14. Графики расходов (Recharts)
15. Сравнение месяцев
16. Обнаружение повторяющихся платежей

**Фаза 5 — Полировка (день 7):**
17. Тёмная тема
18. Настройки пользователя
19. Экспорт CSV
20. Responsive design (mobile-first)
21. E2E тесты

**Фаза 6 — Мультиюзер (будущее):**
22. Включение NextAuth.js (регистрация / логин)
23. OAuth (Google, GitHub)
24. Email verification
25. Семейный доступ (shared budgets)

---

### 3.10 Критерии приёмки

- [ ] Dashboard показывает корректный Safe to Spend
- [ ] Swipe-категоризация работает плавно с анимациями
- [ ] Транзакции: CRUD, фильтрация, поиск
- [ ] Бюджет 50/30/20 корректно рассчитывается
- [ ] Графики отображают реальные данные
- [ ] Тёмная/светлая тема
- [ ] Mobile-responsive
- [ ] Все данные привязаны к userId (готовность к мультиюзер)
- [ ] API защищён middleware авторизации
- [ ] Seed data создаётся при первом запуске
- [ ] PostgreSQL миграции работают из коробки

---

### 3.11 Переменные окружения

```env
DATABASE_URL="postgresql://user:password@localhost:5432/smartbudget"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
MULTI_USER="false"
```

---

*Документ подготовлен на основе анализа DollarWise v6.0 (Caleb Hammer, 2025-2026), публичных данных App Store, Google Play и открытых источников.*
