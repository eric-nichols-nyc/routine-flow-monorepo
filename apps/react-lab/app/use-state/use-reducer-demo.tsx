"use client";

import { useReducer } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

type CartItem = { id: number; name: string; quantity: number; price: number };

type CartAction =
  | { type: "add"; item: Omit<CartItem, "quantity"> }
  | { type: "increment"; id: number }
  | { type: "decrement"; id: number }
  | { type: "remove"; id: number }
  | { type: "clear" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const existing = state.find((item) => item.id === action.item.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case "increment":
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    case "decrement":
      return state
        .map((item) =>
          item.id === action.id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0);
    case "remove":
      return state.filter((item) => item.id !== action.id);
    case "clear":
      return [];
    default:
      return state;
  }
}

const products = [
  { id: 1, name: "React Book", price: 29 },
  { id: 2, name: "TypeScript Guide", price: 35 },
  { id: 3, name: "Next.js Course", price: 49 },
];

export function UseReducerDemo() {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="grid grid-cols-2 gap-6">
        {/* Products */}
        <div>
          <h4 className="text-sm font-medium text-zinc-400 mb-3">Products</h4>
          <div className="space-y-2">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => dispatch({ type: "add", item: product })}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
              >
                <span className="text-zinc-200">{product.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">${product.price}</span>
                  <Plus className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <RenderTracker name="Shopping Cart" color="violet">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-zinc-300">{cart.length} item(s)</span>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-zinc-500">Cart is empty</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-zinc-300">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        dispatch({ type: "decrement", id: item.id })
                      }
                      className="p-1 hover:text-violet-400"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-violet-400">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({ type: "increment", id: item.id })
                      }
                      className="p-1 hover:text-violet-400"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => dispatch({ type: "remove", id: item.id })}
                      className="p-1 hover:text-rose-400 ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-zinc-700 flex justify-between">
                <span className="text-zinc-400">Total:</span>
                <span className="font-bold text-violet-400">${total}</span>
              </div>
              <button
                onClick={() => dispatch({ type: "clear" })}
                className="w-full mt-2 py-1.5 text-xs text-zinc-400 hover:text-rose-400"
              >
                Clear Cart
              </button>
            </div>
          )}
        </RenderTracker>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        ↑ useReducer centralizes complex state logic. All cart operations go
        through the reducer.
      </p>
    </div>
  );
}
