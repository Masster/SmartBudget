import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { BudgetGroup, AccountType, TransactionType, SwipeStatus } from "../src/generated/prisma/enums.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SYSTEM_CATEGORIES = [
  // NEEDS
  { name: "Жильё", icon: "🏠", color: "#3B82F6", budgetGroup: BudgetGroup.NEEDS, sortOrder: 1 },
  { name: "Продукты", icon: "🛒", color: "#10B981", budgetGroup: BudgetGroup.NEEDS, sortOrder: 2 },
  { name: "Транспорт", icon: "🚗", color: "#6366F1", budgetGroup: BudgetGroup.NEEDS, sortOrder: 3 },
  { name: "Здоровье", icon: "💊", color: "#EC4899", budgetGroup: BudgetGroup.NEEDS, sortOrder: 4 },
  { name: "Коммунальные", icon: "💡", color: "#F59E0B", budgetGroup: BudgetGroup.NEEDS, sortOrder: 5 },
  // WANTS
  { name: "Рестораны", icon: "🍽️", color: "#F97316", budgetGroup: BudgetGroup.WANTS, sortOrder: 6 },
  { name: "Развлечения", icon: "🎮", color: "#8B5CF6", budgetGroup: BudgetGroup.WANTS, sortOrder: 7 },
  { name: "Шоппинг", icon: "🛍️", color: "#14B8A6", budgetGroup: BudgetGroup.WANTS, sortOrder: 8 },
  { name: "Подписки", icon: "📱", color: "#EF4444", budgetGroup: BudgetGroup.WANTS, sortOrder: 9 },
  // SAVINGS
  { name: "Сбережения", icon: "🏦", color: "#22C55E", budgetGroup: BudgetGroup.SAVINGS, sortOrder: 10 },
  { name: "Погашение долга", icon: "💳", color: "#E11D48", budgetGroup: BudgetGroup.SAVINGS, sortOrder: 11 },
  { name: "Инвестиции", icon: "📈", color: "#0EA5E9", budgetGroup: BudgetGroup.SAVINGS, sortOrder: 12 },
];

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.recurringTransaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create default user
  const user = await prisma.user.create({
    data: {
      email: "user@smartbudget.local",
      name: "Пользователь",
      currency: "RUB",
      paydayDate: 10,
    },
  });
  console.log(`✅ Created user: ${user.name} (${user.id})`);

  // Create user settings
  await prisma.userSettings.create({
    data: {
      userId: user.id,
      budgetMethod: "50_30_20",
      needsPercent: 50,
      wantsPercent: 30,
      savingsPercent: 20,
      theme: "system",
    },
  });
  console.log("✅ Created user settings");

  // Create system categories
  const categories = await Promise.all(
    SYSTEM_CATEGORIES.map((cat) =>
      prisma.category.create({
        data: {
          ...cat,
          userId: user.id,
          isSystem: true,
        },
      })
    )
  );
  console.log(`✅ Created ${categories.length} system categories`);

  // Create demo accounts
  const mainAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: "Основной счёт",
      type: AccountType.CHECKING,
      balance: 185000,
      currency: "RUB",
      icon: "💳",
      color: "#3B82F6",
    },
  });

  const cashAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: "Наличные",
      type: AccountType.CASH,
      balance: 15000,
      currency: "RUB",
      icon: "💵",
      color: "#22C55E",
    },
  });
  console.log("✅ Created 2 demo accounts");

  // Create demo transactions for last 30 days
  const now = new Date();
  const needsCategories = categories.filter((c) => c.budgetGroup === BudgetGroup.NEEDS);
  const wantsCategories = categories.filter((c) => c.budgetGroup === BudgetGroup.WANTS);
  const savingsCategories = categories.filter((c) => c.budgetGroup === BudgetGroup.SAVINGS);

  const demoTransactions: Array<{
    userId: string;
    accountId: string;
    categoryId: string | null;
    amount: number;
    description: string;
    date: Date;
    type: typeof TransactionType[keyof typeof TransactionType];
    status: typeof SwipeStatus[keyof typeof SwipeStatus];
  }> = [];

  // Income — salary
  demoTransactions.push({
    userId: user.id,
    accountId: mainAccount.id,
    categoryId: null,
    amount: 150000,
    description: "Зарплата",
    date: subDays(now, 28),
    type: TransactionType.INCOME,
    status: SwipeStatus.CATEGORIZED,
  });

  // NEEDS expenses
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

  for (const exp of needsExpenses) {
    const cat = needsCategories.find((c) => c.name === exp.cat);
    demoTransactions.push({
      userId: user.id,
      accountId: mainAccount.id,
      categoryId: cat?.id ?? null,
      amount: -exp.amount,
      description: exp.desc,
      date: subDays(now, exp.daysAgo),
      type: TransactionType.EXPENSE,
      status: SwipeStatus.CATEGORIZED,
    });
  }

  // WANTS expenses
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

  for (const exp of wantsExpenses) {
    const cat = wantsCategories.find((c) => c.name === exp.cat);
    demoTransactions.push({
      userId: user.id,
      accountId: mainAccount.id,
      categoryId: cat?.id ?? null,
      amount: -exp.amount,
      description: exp.desc,
      date: subDays(now, exp.daysAgo),
      type: TransactionType.EXPENSE,
      status: SwipeStatus.CATEGORIZED,
    });
  }

  // SAVINGS
  const savingsExpenses = [
    { desc: "Накопительный счёт", cat: "Сбережения", amount: 15000, daysAgo: 26 },
    { desc: "Кредит погашение", cat: "Погашение долга", amount: 12000, daysAgo: 24 },
  ];

  for (const exp of savingsExpenses) {
    const cat = savingsCategories.find((c) => c.name === exp.cat);
    demoTransactions.push({
      userId: user.id,
      accountId: mainAccount.id,
      categoryId: cat?.id ?? null,
      amount: -exp.amount,
      description: exp.desc,
      date: subDays(now, exp.daysAgo),
      type: TransactionType.EXPENSE,
      status: SwipeStatus.CATEGORIZED,
    });
  }

  // A few uncategorized transactions for swipe demo
  const uncategorized = [
    { desc: "Перевод Иванову", amount: -5000, daysAgo: 0 },
    { desc: "Озон возврат", amount: 2100, daysAgo: 1 },
    { desc: "СберМаркет", amount: -2300, daysAgo: 2 },
    { desc: "Читай-город", amount: -890, daysAgo: 3 },
  ];

  for (const tx of uncategorized) {
    demoTransactions.push({
      userId: user.id,
      accountId: mainAccount.id,
      categoryId: null,
      amount: tx.amount,
      description: tx.desc,
      date: subDays(now, tx.daysAgo),
      type: tx.amount > 0 ? TransactionType.INCOME : TransactionType.EXPENSE,
      status: SwipeStatus.UNCATEGORIZED,
    });
  }

  // Cash transactions
  demoTransactions.push(
    {
      userId: user.id,
      accountId: cashAccount.id,
      categoryId: wantsCategories.find((c) => c.name === "Рестораны")?.id ?? null,
      amount: -800,
      description: "Кофе с собой",
      date: subDays(now, 1),
      type: TransactionType.EXPENSE,
      status: SwipeStatus.CATEGORIZED,
    },
    {
      userId: user.id,
      accountId: cashAccount.id,
      categoryId: needsCategories.find((c) => c.name === "Транспорт")?.id ?? null,
      amount: -350,
      description: "Маршрутка",
      date: subDays(now, 2),
      type: TransactionType.EXPENSE,
      status: SwipeStatus.CATEGORIZED,
    }
  );

  await prisma.transaction.createMany({ data: demoTransactions });
  console.log(`✅ Created ${demoTransactions.length} demo transactions`);

  // Create current month budget
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthlyIncome = 150000;

  await prisma.budget.create({
    data: {
      userId: user.id,
      month: currentMonth,
      year: currentYear,
      totalIncome: monthlyIncome,
      needsLimit: monthlyIncome * 0.5,
      wantsLimit: monthlyIncome * 0.3,
      savingsLimit: monthlyIncome * 0.2,
    },
  });
  console.log("✅ Created current month budget");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
