"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { ShopItemWithOwnership, ShopItemCategory } from "@upwise/shared";

interface CoinShopProps {
  items: ShopItemWithOwnership[];
  balance: number;
  onPurchase: (itemId: string) => void;
  onClose: () => void;
}

const CATEGORIES: { id: ShopItemCategory | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "🛍️" },
  { id: "theme", label: "Themes", emoji: "🎨" },
  { id: "avatar", label: "Avatar", emoji: "👤" },
  { id: "celebration", label: "Celebrations", emoji: "🎉" },
  { id: "sound_pack", label: "Sounds", emoji: "🔊" },
  { id: "brain_break", label: "Breaks", emoji: "🧠" },
  { id: "badge", label: "Badges", emoji: "🏆" },
];

export function CoinShop({ items, balance, onPurchase, onClose }: CoinShopProps) {
  const [activeCategory, setActiveCategory] = useState<ShopItemCategory | "all">("all");
  const [confirmItem, setConfirmItem] = useState<ShopItemWithOwnership | null>(null);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  function handlePurchase(item: ShopItemWithOwnership) {
    if (item.isOwned || balance < item.price) return;
    setConfirmItem(item);
  }

  function confirmPurchase() {
    if (!confirmItem) return;
    onPurchase(confirmItem.id);
    setConfirmItem(null);
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-800">
              Coin Shop
            </h2>
            <p className="text-sm text-gray-500">Spend your hard-earned coins!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-800">$</span>
              </div>
              <span className="font-display font-bold text-amber-700">{balance}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 px-6 py-3 overflow-x-auto border-b border-gray-50">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-[var(--theme-primary)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Item grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className={`card p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                  item.isOwned
                    ? "opacity-60 border-green-200 bg-green-50"
                    : balance < item.price
                      ? "opacity-50"
                      : "hover:shadow-md hover:border-[var(--theme-primary)]"
                }`}
                whileHover={!item.isOwned && balance >= item.price ? { scale: 1.03 } : undefined}
                whileTap={!item.isOwned && balance >= item.price ? { scale: 0.97 } : undefined}
                onClick={() => handlePurchase(item)}
              >
                {/* Item preview */}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-2 text-2xl">
                    {CATEGORIES.find((c) => c.id === item.category)?.emoji ?? "🎁"}
                  </div>
                )}

                <h3 className="font-display font-semibold text-sm text-gray-800">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {item.description}
                </p>

                {/* Price / Owned badge */}
                <div className="mt-3">
                  {item.isOwned ? (
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      Owned
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-yellow-800">$</span>
                      </div>
                      <span className={`text-sm font-bold ${
                        balance >= item.price ? "text-amber-700" : "text-gray-400"
                      }`}>
                        {item.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Limited badge */}
                {item.isLimited && !item.isOwned && (
                  <span className="mt-1 text-[10px] text-purple-600 font-semibold uppercase tracking-wide">
                    Limited
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No items in this category yet!</p>
              <p className="text-sm mt-1">Check back soon.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Purchase confirmation modal */}
      <AnimatePresence>
        {confirmItem && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmItem(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 mx-auto rounded-xl bg-gray-100 flex items-center justify-center mb-4 text-4xl">
                {CATEGORIES.find((c) => c.id === confirmItem.category)?.emoji ?? "🎁"}
              </div>
              <h3 className="font-display text-xl font-bold text-gray-800">
                {confirmItem.name}
              </h3>
              <p className="text-sm text-gray-500 mt-2">{confirmItem.description}</p>

              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-800">$</span>
                </div>
                <span className="font-display text-2xl font-bold text-amber-700">
                  {confirmItem.price}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-1">
                Balance after: {balance - confirmItem.price} coins
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setConfirmItem(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={confirmPurchase}
                  className="flex-1 py-3 rounded-xl bg-[var(--theme-primary)] text-white font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
