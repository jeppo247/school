"use client";

import { motion } from "framer-motion";
import type { CoinTransaction } from "@upwise/shared";

interface CoinHistoryProps {
  transactions: CoinTransaction[];
  balance: number;
}

const REASON_LABELS: Record<string, string> = {
  diagnostic_complete: "Diagnostic complete",
  skill_mastery: "Skill mastered",
  gap_closure: "Gap closed",
  due_review_success: "Review passed",
  sub_strand_complete: "Sub-strand complete",
  strand_complete: "Strand complete",
  year_complete: "Year level complete",
  level_up: "Level up",
  shop_purchase: "Shop purchase",
};

export function CoinHistory({ transactions, balance }: CoinHistoryProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-gray-800">
          Coin History
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center">
            <span className="text-[8px] font-bold text-yellow-800">$</span>
          </div>
          <span className="font-display font-bold text-amber-700">{balance}</span>
        </div>
      </div>

      <div className="space-y-2">
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  tx.type === "earn"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {tx.type === "earn" ? "+" : "-"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {REASON_LABELS[tx.reason] ?? tx.reason}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(tx.createdAt).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <span
              className={`font-display font-bold ${
                tx.type === "earn" ? "text-green-600" : "text-red-500"
              }`}
            >
              {tx.type === "earn" ? "+" : ""}{tx.amount}
            </span>
          </motion.div>
        ))}

        {transactions.length === 0 && (
          <p className="text-center text-gray-400 py-6 text-sm">
            No transactions yet. Start learning to earn coins!
          </p>
        )}
      </div>
    </div>
  );
}
