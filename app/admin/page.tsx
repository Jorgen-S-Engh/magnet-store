'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Order {
  id: string;
  customerName: string;
  packageSize: number;
  images: string[];
  createdAt: string;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Kunne ikke hente bestillinger');
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'En feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = searchTerm
    ? orders.filter((order) =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : orders;

  // Grupper bestillinger etter kunde
  const ordersByCustomer = filteredOrders.reduce((acc, order) => {
    if (!acc[order.customerName]) {
      acc[order.customerName] = [];
    }
    acc[order.customerName].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center py-16 px-4 sm:px-8">
        <div className="w-full max-w-6xl space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Admin - Bestillingsoversikt
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Se alle bestillinger med kundenavn og pakkestørrelse
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Søk etter kundenavn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Henter...' : 'Oppdater'}
              </button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-zinc-600 dark:text-zinc-400">Henter bestillinger...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-600 dark:text-zinc-400">
                  {searchTerm ? 'Ingen bestillinger funnet for dette søket' : 'Ingen bestillinger ennå'}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(ordersByCustomer).map(([customerName, customerOrders]) => (
                  <div
                    key={customerName}
                    className="border-b border-zinc-200 dark:border-zinc-700 pb-8 last:border-0 last:pb-0"
                  >
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {customerName}
                      </h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {customerOrders.length} {customerOrders.length === 1 ? 'pakke' : 'pakker'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {customerOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg">
                                Pakke med {order.packageSize} magneter
                              </p>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                Bestillings-ID: {order.id}
                              </p>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Bestilt: {new Date(order.createdAt).toLocaleString('no-NO')}
                              </p>
                            </div>
                            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                              {order.packageSize} magneter
                            </div>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                            {order.images.map((url, index) => (
                              <div
                                key={index}
                                className="relative aspect-square rounded overflow-hidden border border-zinc-200 dark:border-zinc-700"
                              >
                                <Image
                                  src={url}
                                  alt={`Magnet ${index + 1} for ${customerName}`}
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
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredOrders.length > 0 && (
              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                  Totalt {filteredOrders.length} {filteredOrders.length === 1 ? 'bestilling' : 'bestillinger'}
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
