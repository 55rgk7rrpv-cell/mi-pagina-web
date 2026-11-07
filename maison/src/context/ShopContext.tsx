"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "@/lib/products";
import { PROMOS, computeTotals, type Promo } from "@/lib/pricing";

export interface CartLine {
  key: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
}

interface State {
  lines: CartLine[];
  promo: string | null;
}

type Action =
  | { type: "hydrate"; state: State }
  | { type: "add"; productId: string; size: string; color: string; qty?: number }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "promo"; code: string | null }
  | { type: "clear" };

const MAX_QTY = 5;
const STORAGE_KEY = "otrapinta.bag.v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const key = `${action.productId}__${action.size}__${action.color}`;
      const product = getProduct(action.productId);
      const cap = Math.min(MAX_QTY, product?.stock ?? MAX_QTY);
      const existing = state.lines.find((l) => l.key === key);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, qty: Math.min(cap, l.qty + (action.qty ?? 1)) } : l,
          ),
        };
      }
      return {
        ...state,
        lines: [
          { key, productId: action.productId, size: action.size, color: action.color, qty: Math.min(cap, action.qty ?? 1) },
          ...state.lines,
        ],
      };
    }
    case "setQty": {
      if (action.qty <= 0) return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };
      return {
        ...state,
        lines: state.lines.map((l) => {
          if (l.key !== action.key) return l;
          const cap = Math.min(MAX_QTY, getProduct(l.productId)?.stock ?? MAX_QTY);
          return { ...l, qty: Math.min(cap, action.qty) };
        }),
      };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };
    case "promo":
      return { ...state, promo: action.code };
    case "clear":
      return { lines: [], promo: null };
  }
}

export interface EnrichedLine extends CartLine {
  product: Product;
  lineTotal: number;
}

interface ShopValue {
  lines: EnrichedLine[];
  count: number;
  promo: Promo | null;
  totals: ReturnType<typeof computeTotals>;
  hydrated: boolean;
  add: (productId: string, size: string, color: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
  clear: () => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  checkoutOpen: boolean;
  openCheckout: () => void;
  /** Leave checkout, optionally landing on a section id */
  leaveCheckout: (section?: string) => void;
  quickViewId: string | null;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;
  maxQty: number;
}

const ShopContext = createContext<ShopValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], promo: null });
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Checkout lives on the same page at #checkout, so the back button works
  // and the whole store can be served as a single static page.
  useEffect(() => {
    const sync = () => setCheckoutOpen(window.location.hash === "#checkout");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Restore the bag after mount so server and client markup match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        const lines = Array.isArray(parsed.lines) ? parsed.lines.filter((l) => getProduct(l.productId)) : [];
        dispatch({ type: "hydrate", state: { lines, promo: parsed.promo ?? null } });
      }
    } catch {
      /* storage unavailable: start with an empty bag */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / privacy mode */
    }
  }, [state, hydrated]);

  const lines = useMemo<EnrichedLine[]>(
    () =>
      state.lines.flatMap((l) => {
        const product = getProduct(l.productId);
        return product ? [{ ...l, product, lineTotal: product.price * l.qty }] : [];
      }),
    [state.lines],
  );

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const promo = state.promo ? PROMOS[state.promo] ?? null : null;
  const totals = useMemo(() => computeTotals(subtotal, promo), [subtotal, promo]);

  const add = useCallback((productId: string, size: string, color: string, qty?: number) => {
    dispatch({ type: "add", productId, size, color, qty });
  }, []);

  const applyPromo = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      if (!code) return { ok: false, message: "Enter a code." };
      const found = PROMOS[code];
      if (!found) return { ok: false, message: "That code isn't recognised." };
      if (found.min && subtotal < found.min) {
        return { ok: false, message: `This code unlocks at a subtotal of $${found.min.toLocaleString()}.` };
      }
      dispatch({ type: "promo", code });
      return { ok: true, message: found.label };
    },
    [subtotal],
  );

  const value: ShopValue = {
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    promo,
    totals,
    hydrated,
    add,
    setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
    remove: (key) => dispatch({ type: "remove", key }),
    applyPromo,
    clearPromo: () => dispatch({ type: "promo", code: null }),
    clear: () => dispatch({ type: "clear" }),
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    checkoutOpen,
    openCheckout: () => {
      setCartOpen(false);
      window.location.hash = "checkout";
    },
    leaveCheckout: (section) => {
      window.location.hash = section ?? "top";
    },
    quickViewId,
    openQuickView: (id) => setQuickViewId(id),
    closeQuickView: () => setQuickViewId(null),
    maxQty: MAX_QTY,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
