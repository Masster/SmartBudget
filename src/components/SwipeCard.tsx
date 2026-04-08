"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { formatMoney } from "@/lib/budget-calculator";
import { cn } from "@/lib/utils";
import type { Transaction, Account } from "@/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type TransactionWithAccount = Transaction & { account?: Account | null };

interface Props {
  transaction: TransactionWithAccount;
  onSwipe: (direction: "left" | "right" | "up") => void;
  onTap: () => void;
}

const SWIPE_THRESHOLD = 120;

export function SwipeCard({ transaction, onSwipe, onTap }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const dist = Math.sqrt(latestX ** 2 + latestY ** 2);
      return 1 - Math.min(dist / 400, 0.5);
    }
  );

  // Direction indicators
  const needsOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const wantsOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const savingsOpacity = useTransform(y, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;

    // Check for vertical swipe first (up = savings)
    if (offset.y < -SWIPE_THRESHOLD) {
      onSwipe("up");
      return;
    }

    // Horizontal swipes
    if (offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    } else if (offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    }
  };

  return (
    <motion.div
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onTap={onTap}
      whileTap={{ scale: 1.02 }}
      exit={{
        x: x.get() < -50 ? -500 : x.get() > 50 ? 500 : 0,
        y: y.get() < -50 ? -500 : 0,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <div className="relative rounded-2xl bg-card border shadow-lg overflow-hidden">
        {/* Direction indicators */}
        <motion.div
          className="absolute inset-0 bg-blue-500/20 flex items-center justify-start pl-6"
          style={{ opacity: needsOpacity }}
        >
          <span className="text-3xl font-bold text-blue-600">NEEDS</span>
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-orange-500/20 flex items-center justify-end pr-6"
          style={{ opacity: wantsOpacity }}
        >
          <span className="text-3xl font-bold text-orange-600">WANTS</span>
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
          style={{ opacity: savingsOpacity }}
        >
          <span className="text-3xl font-bold text-green-600">SAVINGS</span>
        </motion.div>

        {/* Card content */}
        <div className="relative p-8 text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            {format(new Date(transaction.date), "d MMMM yyyy", { locale: ru })}
          </p>
          <p className={cn(
            "text-4xl font-bold tabular-nums",
            Number(transaction.amount) > 0 ? "text-green-600" : ""
          )}>
            {formatMoney(Number(transaction.amount))}
          </p>
          <p className="text-lg font-medium">{transaction.description}</p>
          <p className="text-sm text-muted-foreground">
            {transaction.account?.icon} {transaction.account?.name}
          </p>

          {/* Swipe hints */}
          <div className="flex justify-between text-xs text-muted-foreground pt-4 border-t">
            <span>← Необходимое</span>
            <span>↑ Сбережения</span>
            <span>Желания →</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
