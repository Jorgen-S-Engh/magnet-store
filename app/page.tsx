'use client';

import { useState } from 'react';
import ImageUpload from './components/ImageUpload';

const PACKAGE_OPTIONS = [
  { size: 6, label: '6 magneter' },
  { size: 9, label: '9 magneter' },
  { size: 12, label: '12 magneter' },
];

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

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

          {selectedPackage && (
            <ImageUpload requiredCount={selectedPackage as number} />
          )}

          {!selectedPackage && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Velg en pakkestørrelse for å begynne å laste opp bilder
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
