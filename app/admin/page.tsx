'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const ADMIN_TOKEN_KEY = 'admin_token';

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9æøåÆØÅ_-]/g, '_').slice(0, 50);
}

interface DeliveryAddress {
  street: string;
  postalCode: string;
  city: string;
  email: string;
  phone?: string;
}

interface Order {
  id: string;
  customerName: string;
  packageSize: number;
  images: string[];
  deliveryAddress?: DeliveryAddress;
  createdAt: string;
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);

  useEffect(() => {
    setAuthenticated(!!(typeof window !== 'undefined' && sessionStorage.getItem(ADMIN_TOKEN_KEY)));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Innlogging feilet');
        return;
      }
      if (data.token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setAuthenticated(true);
      }
    } catch {
      setLoginError('En feil oppstod');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setAuthenticated(false);
  };

  useEffect(() => {
    if (authenticated) fetchOrders();
  }, [authenticated]);

  const downloadPackageImages = async (order: Order, customerName: string, orderIndex: number) => {
    setDownloadingOrderId(order.id);
    const prefix = `${sanitizeFilename(customerName)}_Pakke${orderIndex + 1}_`;
    try {
      for (let i = 0; i < order.images.length; i++) {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(order.images[i])}`;
        const response = await fetch(proxyUrl, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(`Kunne ikke hente bilde ${i + 1}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${prefix}bilde_${i + 1}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke laste ned bildene');
    } finally {
      setDownloadingOrderId(null);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/orders', { headers: getAuthHeaders() });
      if (response.status === 401) {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        setAuthenticated(false);
        return;
      }
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

  const ordersByCustomer = filteredOrders.reduce((acc, order) => {
    if (!acc[order.customerName]) {
      acc[order.customerName] = [];
    }
    acc[order.customerName].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans flex items-center justify-center">
        <p className="text-zinc-500">Laster...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm"
        >
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
            Admin-innlogging
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Skriv inn passord for å få tilgang
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord"
            autoFocus
            className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          {loginError && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{loginError}</p>
          )}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginLoading ? 'Logger inn...' : 'Logg inn'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Bestillingsoversikt
            </h1>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Oversikt over alle bestillinger, gruppert per kunde
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Logg ut
          </button>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Søk etter kundenavn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? 'Henter...' : 'Oppdater'}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">Henter bestillinger...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">
              {searchTerm ? 'Ingen bestillinger funnet for dette søket' : 'Ingen bestillinger ennå'}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(ordersByCustomer).map(([customerName, customerOrders]) => (
              <section
                key={customerName}
                className="rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm"
              >
                {/* Kundehode – tydelig skilt */}
                <div className="px-6 py-4 bg-zinc-800 dark:bg-zinc-800 text-white">
                  <h2 className="text-xl font-bold">{customerName}</h2>
                  <p className="text-sm text-zinc-300 mt-0.5">
                    {customerOrders.length} {customerOrders.length === 1 ? 'pakke' : 'pakker'} ·{' '}
                    {customerOrders.reduce((sum, o) => sum + o.packageSize, 0)} magneter totalt
                  </p>
                </div>

                <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {customerOrders.map((order, orderIndex) => (
                    <div
                      key={order.id}
                      className="px-6 py-5"
                    >
                      {/* Pakke-info */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <span className="inline-block px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-md text-sm font-semibold">
                            Pakke {orderIndex + 1} · {order.packageSize} magneter
                          </span>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                            Bestilt {new Date(order.createdAt).toLocaleString('no-NO')} · ID: {order.id}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadPackageImages(order, customerName, orderIndex)}
                          disabled={downloadingOrderId === order.id}
                          className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                          {downloadingOrderId === order.id ? 'Laster ned...' : 'Last ned alle bilder'}
                        </button>
                      </div>

                      {/* Leveringsadresse – tydelig visuelt skilt */}
                      {order.deliveryAddress && (
                        <div className="mb-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                            Leveringsadresse
                          </p>
                          <p className="text-zinc-800 dark:text-zinc-200">
                            {order.deliveryAddress.street}
                          </p>
                          <p className="text-zinc-800 dark:text-zinc-200">
                            {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
                          </p>
                          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
                            {order.deliveryAddress.email}
                            {order.deliveryAddress.phone && ` · ${order.deliveryAddress.phone}`}
                          </p>
                        </div>
                      )}

                      {/* Bilder – tydelig merket */}
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                          Bildene ({order.images.length} stk)
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {order.images.map((url, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
                            >
                              <Image
                                src={url}
                                alt={`Magnet ${index + 1} for ${customerName}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                              />
                              <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-xs font-medium px-2 py-0.5 rounded">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {!loading && filteredOrders.length > 0 && (
          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Totalt {filteredOrders.length} {filteredOrders.length === 1 ? 'bestilling' : 'bestillinger'}
            {searchTerm && ` for «${searchTerm}»`}
          </p>
        )}
      </main>
    </div>
  );
}
