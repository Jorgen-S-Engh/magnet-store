'use client';

import { useState } from 'react';

interface CustomerFormProps {
  onSubmit: (customerName: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function CustomerForm({ onSubmit, onCancel, isLoading }: CustomerFormProps) {
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim()) {
      onSubmit(customerName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          Kundenavn *
        </label>
        <input
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="F.eks. Kari Hansen"
          required
          disabled={isLoading}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Dette navnet vil bli knyttet til bildene og pakken
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!customerName.trim() || isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Legger til...' : 'Legg til i handlekurv'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Avbryt
          </button>
        )}
      </div>
    </form>
  );
}

