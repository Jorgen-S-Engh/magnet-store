'use client';

import { useCartStore, type CartItem } from '../store/cartStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { items, removeItem, clearCart } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Handlekurv
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Handlekurven er tom
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Handlekurv ({items.length} {items.length === 1 ? 'pakke' : 'pakker'})
        </h2>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
          >
            Tøm handlekurv
          </button>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  Pakke med {item.packageSize} magneter
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Lagt til: {new Date(item.createdAt).toLocaleString('no-NO')}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 rounded transition-colors"
              >
                Fjern
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {item.images.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded overflow-hidden border border-zinc-200 dark:border-zinc-700"
                >
                  <Image
                    src={url}
                    alt={`Magnet ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Gå til checkout ({items.length} {items.length === 1 ? 'pakke' : 'pakker'})
          </button>
        </div>
      )}
    </div>
  );
}

