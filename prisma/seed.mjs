import "dotenv/config";
import pg from "pg";

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

function cuid() {
  return "c" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function subDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

const SYSTEM_CATEGORIES = [
  { name: "Жильё", icon: "🏠", color: "#3B82F6", budgetGroup: "NEEDS", sortOrder: 1 },
  { name: "Продукты", icon: "🛒", color: "#10B981", budgetGroup: "NEEDS", sortOrder: 2 },
  { name: "Транспорт", icon: "🚗", color: "#6366F1", budgetGroup: "NEEDS", sortOrder: 3 },
  { name: "Здоровье", icon: "💊", color: "#EC4899", budgetGroup: "NEEDS", sortOrder: 4 },
  { name: "Коммунальные", icon: "💡", color: "#F59E0B", budgetGroup: "NEEDS", sortOrder: 5 },
  { name: "Рестораны", icon: "🍽️", color: "#F97316", budgetGroup: "WANTS", sortOrder: 6 },
  { name: "Развлечения", icon: "🎮", color: "#8B5CF6", budgetGroup: "WANTS", sortOrder: 7 },
  { name: "Шоппинг", icon: "🛍️", color: "#14B8A6", budgetGroup: "WANTS", sortOrder: 8 },
  { name: "Подписки", icon: "📱", color: "#EF4444", budgetGroup: "WANTS", sortOrder: 9 },
  { name: "Сбережения", icon: "🏦", color: "#22C55E", budgetGroup: "SAVINGS", sortOrder: 10 },
  { name: "Погашение долга", icon: "💳", color: "#E11D48", budgetGroup: "SAVINGS", sortOrder: 11 },
  { name: "Инвестиции", icon: "📈", color: "#0EA5E9", budgetGroup: "SAVINGS", sortOrder: 12 },
];

async function main() {
  await client.connect();
  console.log("🌱 Seeding database...");

  // Clean up
  await client.query('DELETE FROM "Transaction"');
  await client.query('DELETE FROM "Budget"');
  await client.query('DELETE FROM "RecurringTransaction"');
  await client.query('DELETE FROM "Category"');
  await client.query('DELETE FROM "Account"');
  await client.query('DELETE FROM "UserSettings"');
  await client.query('DELETE FROM "Session"');
  await client.query('DELETE FROM "User"');

  // Create user
  const userId = cuid();
  const now = new Date();
  await client.query(
    `INSERT INTO "User" (id, email, name, currency, "paydayDate", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, "user@smartbudget.local", "Пользователь", "RUB", 10, now, now]
  );
  console.log(`✅ Created user: Пользователь (${userId})`);

  // Create user settings
  await client.query(
    `INSERT INTO "UserSettings" (id, "userId", "budgetMethod", "needsPercent", "wantsPercent", "savingsPercent", "notificationsOn", "weekStartDay", theme)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [cuid(), userId, "50_30_20", 50, 30, 20, true, 1, "system"]
  );
  console.log("✅ Created user settings");

  // Create categories
  const categoryMap = {};
  for (const cat of SYSTEM_CATEGORIES) {
    const catId = cuid();
    await client.query(
      `INSERT INTO "Category" (id, "userId", name, icon, color, "budgetGroup", "isSystem", "sortOrder", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6::\"BudgetGroup\", $7, $8, $9)`,
      [catId, userId, cat.name, cat.icon, cat.color, cat.budgetGroup, true, cat.sortOrder, now]
    );
    categoryMap[cat.name] = catId;
  }
  console.log(`✅ Created ${SYSTEM_CATEGORIES.length} system categories`);

  // Create accounts
  const mainAccountId = cuid();
  const cashAccountId = cuid();
  await client.query(
    `INSERT INTO "Account" (id, "userId", name, type, balance, currency, icon, color, "isActive", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4::\"AccountType\", $5, $6, $7, $8, $9, $10, $11)`,
    [mainAccountId, userId, "Основной счёт", "CHECKING", 185000, "RUB", "💳", "#3B82F6", true, now, now]
  );
  await client.query(
    `INSERT INTO "Account" (id, "userId", name, type, balance, currency, icon, color, "isActive", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4::\"AccountType\", $5, $6, $7, $8, $9, $10, $11)`,
    [cashAccountId, userId, "Наличные", "CASH", 15000, "RUB", "💵", "#22C55E", true, now, now]
  );
  console.log("✅ Created 2 demo accounts");

  // Build all transactions
  const txs = [];

  // Income
  txs.push({
    accountId: mainAccountId, categoryId: null, amount: 150000,
    description: "Зарплата", date: subDays(now, 28), type: "INCOME", status: "CATEGORIZED",
  });

  // NEEDS
  const needsExpenses = [
    { desc: "Аренда квартиры", cat: "Жильё", amount: 35000, daysAgo: 25 },
    { desc: "Пятёрочка", cat: "Продукты", amount: 3200, daysAgo: 1 },
    { desc: "Перекрёсток", cat: "Продукты", amount: 4500, daysAgo: 4 },
    { desc: "Магнит", cat: "Продукты", amount: 2800, daysAgo: 8 },
    { desc: "ВкусВилл", cat: "Продукты", amount: 3600, daysAgo: 12 },
    { desc: "Яндекс Лавка", cat: "Продукты", amount: 1900, daysAgo: 16 },
    { desc: "Метро Москва", cat: "Транспорт", amount: 2400, daysAgo: 2 },
    { desc: "Яндекс Такси", cat: "Транспорт", amount: 850, daysAgo: 6 },
    { desc: "Бензин Лукойл", cat: "Транспорт", amount: 3500, daysAgo: 15 },
    { desc: "Аптека Ригла", cat: "Здоровье", amount: 1200, daysAgo: 10 },
    { desc: "ЖКХ оплата", cat: "Коммунальные", amount: 8500, daysAgo: 22 },
    { desc: "Интернет Ростелеком", cat: "Коммунальные", amount: 700, daysAgo: 20 },
  ];
  for (const e of needsExpenses) {
    txs.push({
      accountId: mainAccountId, categoryId: categoryMap[e.cat], amount: -e.amount,
      description: e.desc, date: subDays(now, e.daysAgo), type: "EXPENSE", status: "CATEGORIZED",
    });
  }

  // WANTS
  const wantsExpenses = [
    { desc: "Якитория", cat: "Рестораны", amount: 2800, daysAgo: 3 },
    { desc: "KFC доставка", cat: "Рестораны", amount: 950, daysAgo: 7 },
    { desc: "Кофемания", cat: "Рестораны", amount: 1200, daysAgo: 14 },
    { desc: "Кинопоиск", cat: "Подписки", amount: 399, daysAgo: 5 },
    { desc: "Яндекс Плюс", cat: "Подписки", amount: 399, daysAgo: 5 },
    { desc: "Spotify", cat: "Подписки", amount: 299, daysAgo: 5 },
    { desc: "Steam покупка", cat: "Развлечения", amount: 1500, daysAgo: 9 },
    { desc: "Ozon заказ", cat: "Шоппинг", amount: 4200, daysAgo: 11 },
    { desc: "Wildberries", cat: "Шоппинг", amount: 3500, daysAgo: 18 },
  ];
  for (const e of wantsExpenses) {
    txs.push({
      accountId: mainAccountId, categoryId: categoryMap[e.cat], amount: -e.amount,
      description: e.desc, date: subDays(now, e.daysAgo), type: "EXPENSE", status: "CATEGORIZED",
    });
  }

  // SAVINGS
  txs.push({
    accountId: mainAccountId, categoryId: categoryMap["Сбережения"], amount: -15000,
    description: "Накопительный счёт", date: subDays(now, 26), type: "EXPENSE", status: "CATEGORIZED",
  });
  txs.push({
    accountId: mainAccountId, categoryId: categoryMap["Погашение долга"], amount: -12000,
    description: "Кредит погашение", date: subDays(now, 24), type: "EXPENSE", status: "CATEGORIZED",
  });

  // Uncategorized (for swipe demo)
  const uncategorized = [
    { desc: "Перевод Иванову", amount: -5000, daysAgo: 0 },
    { desc: "Озон возврат", amount: 2100, daysAgo: 1 },
    { desc: "СберМаркет", amount: -2300, daysAgo: 2 },
    { desc: "Читай-город", amount: -890, daysAgo: 3 },
  ];
  for (const tx of uncategorized) {
    txs.push({
      accountId: mainAccountId, categoryId: null, amount: tx.amount,
      description: tx.desc, date: subDays(now, tx.daysAgo),
      type: tx.amount > 0 ? "INCOME" : "EXPENSE", status: "UNCATEGORIZED",
    });
  }

  // Cash transactions
  txs.push({
    accountId: cashAccountId, categoryId: categoryMap["Рестораны"], amount: -800,
    description: "Кофе с собой", date: subDays(now, 1), type: "EXPENSE", status: "CATEGORIZED",
  });
  txs.push({
    accountId: cashAccountId, categoryId: categoryMap["Транспорт"], amount: -350,
    description: "Маршрутка", date: subDays(now, 2), type: "EXPENSE", status: "CATEGORIZED",
  });

  // Insert all transactions
  for (const tx of txs) {
    await client.query(
      `INSERT INTO "Transaction" (id, "userId", "accountId", "categoryId", amount, description, date, type, "isRecurring", "recurringId", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::\"TransactionType\", $9, $10, $11::\"SwipeStatus\", $12, $13)`,
      [cuid(), userId, tx.accountId, tx.categoryId, tx.amount, tx.description, tx.date, tx.type, false, null, tx.status, now, now]
    );
  }
  console.log(`✅ Created ${txs.length} demo transactions`);

  // Create current month budget
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthlyIncome = 150000;
  await client.query(
    `INSERT INTO "Budget" (id, "userId", month, year, "totalIncome", "needsLimit", "wantsLimit", "savingsLimit", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [cuid(), userId, currentMonth, currentYear, monthlyIncome, monthlyIncome * 0.5, monthlyIncome * 0.3, monthlyIncome * 0.2, now, now]
  );
  console.log("✅ Created current month budget");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
