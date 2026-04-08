"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { SwipeCard } from "@/components/SwipeCard";
import { useUncategorizedTransactions, useUpdateTransaction } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Category } from "@/types";
import Link from "next/link";

type BudgetGroup = "NEEDS" | "WANTS" | "SAVINGS";

export default function SwipePage() {
  const { data: uncategorized, isLoading } = useUncategorizedTransactions();
  const { data: categories } = useCategories();
  const updateTransaction = useUpdateTransaction();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BudgetGroup | null>(null);

  const transactions = uncategorized ?? [];
  const currentTx = transactions[currentIndex];
  const remaining = transactions.length - currentIndex;

  const categorizeByGroup = useCallback(
    (group: BudgetGroup) => {
      setSelectedGroup(group);
      setShowCategoryPicker(true);
    },
    []
  );

  const handleSwipe = useCallback(
    (direction: "left" | "right" | "up") => {
      const groupMap: Record<string, BudgetGroup> = {
        left: "NEEDS",
        right: "WANTS",
        up: "SAVINGS",
      };
      categorizeByGroup(groupMap[direction]);
    },
    [categorizeByGroup]
  );

  const handleCategorySelect = (category: Category) => {
    if (!currentTx) return;
    updateTransaction.mutate(
      { id: currentTx.id, categoryId: category.id },
      {
        onSuccess: () => {
          setShowCategoryPicker(false);
          setSelectedGroup(null);
          setCurrentIndex((i) => i + 1);
        },
      }
    );
  };

  const handleTap = () => {
    setShowCategoryPicker(true);
    setSelectedGroup(null);
  };

  const groupCategories = categories?.filter(
    (c) => !selectedGroup || c.budgetGroup === selectedGroup
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-64 w-80 bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (remaining <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <span className="text-6xl">✅</span>
        <h2 className="text-2xl font-bold">Всё категоризировано!</h2>
        <p className="text-muted-foreground">Нет транзакций, ожидающих категоризации</p>
        <Link href="/">
          <Button>Вернуться на главную</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Свайп-категоризация</h1>
        <Badge variant="secondary" className="text-sm">
          Осталось: {remaining}
        </Badge>
      </div>

      {/* Swipe area */}
      <div className="relative flex items-center justify-center h-[400px]">
        <AnimatePresence>
          {currentTx && (
            <SwipeCard
              key={currentTx.id}
              transaction={currentTx}
              onSwipe={handleSwipe}
              onTap={handleTap}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Quick action buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="border-blue-300 text-blue-600 hover:bg-blue-50"
          onClick={() => categorizeByGroup("NEEDS")}
        >
          ← Необходимое
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-green-300 text-green-600 hover:bg-green-50"
          onClick={() => categorizeByGroup("SAVINGS")}
        >
          ↑ Сбережения
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
          onClick={() => categorizeByGroup("WANTS")}
        >
          Желания →
        </Button>
      </div>

      {/* Category picker dialog */}
      <Dialog open={showCategoryPicker} onOpenChange={setShowCategoryPicker}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedGroup
                ? `Выберите категорию (${
                    { NEEDS: "Необходимое", WANTS: "Желания", SAVINGS: "Сбережения" }[selectedGroup]
                  })`
                : "Выберите категорию"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {groupCategories?.map((cat) => (
              <Button
                key={cat.id}
                variant="outline"
                className="justify-start gap-2 h-auto py-3"
                onClick={() => handleCategorySelect(cat)}
                disabled={updateTransaction.isPending}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
