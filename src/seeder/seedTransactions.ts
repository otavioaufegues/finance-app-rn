import { createTransaction, type TransactionType } from "@/services/transactions";
import { ensureDefaultCategories } from "@/services/categories";

const transactionTemplates = [
  { title: "Supermercado", category: "Alimentacao", type: "expense" },
  { title: "Almoco", category: "Alimentacao", type: "expense" },
  { title: "Uber", category: "Transporte", type: "expense" },
  { title: "Combustivel", category: "Transporte", type: "expense" },
  { title: "Cinema", category: "Lazer", type: "expense" },
  { title: "Streaming", category: "Lazer", type: "expense" },
  { title: "Salario mensal", category: "Salario", type: "income" },
  { title: "Freelance", category: "Salario", type: "income" },
] as const;

function randomTemplate() {
  return transactionTemplates[
    Math.floor(Math.random() * transactionTemplates.length)
  ];
}

function randomAmount() {
  return Number((Math.random() * 490 + 10).toFixed(2));
}

function randomTypeFallback(): TransactionType {
  return Math.random() > 0.5 ? "income" : "expense";
}

function randomDate() {
  const start = new Date(2024, 0, 1);
  const end = new Date();

  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );

  return date.toISOString().slice(0, 10);
}

export async function seedTransactions(userId: string, total = 50) {
  await ensureDefaultCategories(userId);

  for (let i = 0; i < total; i++) {
    const template = randomTemplate();

    await createTransaction(userId, {
      title: `${template.title} ${i + 1}`,
      amount: randomAmount(),
      type: template.type ?? randomTypeFallback(),
      category: template.category,
      transactionDate: randomDate(),
      receiptUrl: "",
    });
  }
}
