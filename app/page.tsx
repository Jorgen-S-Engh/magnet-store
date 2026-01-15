'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageUpload from './components/ImageUpload';
import Cart from './components/Cart';
import { useCartStore } from './store/cartStore';

const PACKAGE_OPTIONS = [
  { size: 6, label: '6 magneter' },
  { size: 9, label: '9 magneter' },
  { size: 12, label: '12 magneter' },
];

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [confirmedImages, setConfirmedImages] = useState<string[] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem } = useCartStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      // Fjern query parameter fra URL
      window.history.replaceState({}, '', '/');
      // Skjul meldingen etter 5 sekunder
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleConfirm = (imageUrls: string[]) => {
    if (!selectedPackage) return;

    // Legg direkte til i handlekurv uten navn
    addItem({
      packageSize: selectedPackage,
      images: imageUrls,
    });

    // Reset form
    setConfirmedImages(null);
    setSelectedPackage(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center py-16 px-4 sm:px-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Magnet Store
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Velg pakkestørrelse og last opp bilder for dine magneter
            </p>
          </div>

          {showSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                ✓ Bestillingen din er sendt! Takk for handelen.
              </p>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Velg pakkestørrelse
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PACKAGE_OPTIONS.map((option) => (
                <button
                  key={option.size}
                  onClick={() => setSelectedPackage(option.size)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPackage === option.size
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="font-semibold text-lg">{option.label}</div>
                  <div className="text-sm mt-1">
                    Last opp {option.size} bilder
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedPackage && !confirmedImages && (
            <ImageUpload 
              requiredCount={selectedPackage as number} 
              onConfirm={handleConfirm}
            />
          )}

          {!selectedPackage && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Velg en pakkestørrelse for å begynne å laste opp bilder
              </p>
            </div>
          )}

          <Cart />
        </div>
      </main>
    </div>
  );
}
