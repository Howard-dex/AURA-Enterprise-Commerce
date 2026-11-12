import { create } from 'zustand';
import { CartItem } from '@/types/product';

interface CartState {
  items: CartItem[];
  couponCode: string;
  addItem: (item: CartItem) => void;
  removeItem: (sku: string, variantLabel: string) => void;
  updateQty: (sku: string, variantLabel: string, qty: number) => void;
  setCoupon: (code: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  couponCode: '',
  addItem: (newItem) =>
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.sku === newItem.sku && i.variantLabel === newItem.variantLabel
      );
      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += newItem.quantity;
        return { items: updated };
      }
      return { items: [...state.items, newItem] };
    }),
  removeItem: (sku, variantLabel) =>
    set((state) => ({
      items: state.items.filter((i) => !(i.sku === sku && i.variantLabel === variantLabel))
    })),
  updateQty: (sku, variantLabel, qty) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.sku === sku && i.variantLabel === variantLabel ? { ...i, quantity: Math.max(1, qty) } : i
      )
    })),
  setCoupon: (code) => set({ couponCode: code }),
  clearCart: () => set({ items: [], couponCode: '' })
}));
