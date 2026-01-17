'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/cartStore';
import CustomerForm, { type DeliveryAddress } from '../components/CustomerForm';

export default function Checkout() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (customerName: string, deliveryAddress?: DeliveryAddress) => {
    if (items.length === 0) {
      setError('Handlekurven er tom');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Send alle bestillinger til server med samme kundenavn
      const orderPromises = items.map((item) =>
        fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName,
            packageSize: item.packageSize,
            images: item.images,
            deliveryAddress,
          }),
        })
      );

      const responses = await Promise.all(orderPromises);

      // Sjekk om alle bestillinger ble lagret
      const failedResponses = responses.filter((response) => !response.ok);
      if (failedResponses.length > 0) {
        const errorData = await failedResponses[0].json();
        throw new Error(errorData.error || 'Kunne ikke lagre alle bestillingene');
      }

      // Tøm handlekurven
      clearCart();

      // Redirect til hjemmeside med suksessmelding
      router.push('/?success=true');
    } catch (err) {
      console.error('Feil ved lagring:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke lagre bestillingene');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full flex-col items-center py-16 px-4 sm:px-8">
          <div className="w-full max-w-4xl">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
              <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Checkout
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Handlekurven er tom. Legg til produkter før du går til checkout.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Gå tilbake til butikken
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center py-16 px-4 sm:px-8">
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Checkout
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Skriv inn kundenavn og leveringsadresse for å fullføre bestillingen
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Bestillingsoversikt
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Du skal bestille {items.length} {items.length === 1 ? 'pakke' : 'pakker'} med totalt{' '}
              {items.reduce((sum, item) => sum + item.packageSize, 0)} magneter.
            </p>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <CustomerForm
              onSubmit={handleSubmit}
              onCancel={() => router.push('/')}
              isLoading={isSubmitting}
              includeDeliveryAddress={true}
              submitButtonText="Fullfør bestilling"
              loadingButtonText="Sender bestilling..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
