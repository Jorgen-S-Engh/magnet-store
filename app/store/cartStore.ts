import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  packageSize: number;
  images: string[];
  createdAt: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'createdAt'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const newItem: CartItem = {
          ...item,
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          items: [...state.items, newItem],
        }));
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'magnet-store-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

