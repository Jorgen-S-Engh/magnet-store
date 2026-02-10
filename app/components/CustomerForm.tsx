'use client';

import { useState } from 'react';

interface CustomerFormProps {
  onSubmit: (customerName: string, deliveryAddress?: DeliveryAddress) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  includeDeliveryAddress?: boolean;
  submitButtonText?: string;
  loadingButtonText?: string;
}

export interface DeliveryAddress {
  street: string;
  postalCode: string;
  city: string;
  email: string;
  phone?: string;
}

export default function CustomerForm({ onSubmit, onCancel, isLoading, includeDeliveryAddress = false, submitButtonText, loadingButtonText }: CustomerFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Valider epost format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Valider postnummer (4 tall)
  const validatePostalCode = (code: string): boolean => {
    return /^\d{4}$/.test(code);
  };

  // Telefon er valgfritt, men hvis det fylles inn gjør vi en enkel sanity-check
  // (min 8 sifre etter at vi har fjernet mellomrom/tegn)
  const validatePhone = (value: string): boolean => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 8;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    // Valider kundenavn
    if (!customerName.trim()) {
      newErrors.customerName = 'Kundenavn er påkrevd';
    }

    // Valider epost
    if (includeDeliveryAddress) {
      if (!email.trim()) {
        newErrors.email = 'Epost er påkrevd';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Ugyldig epost-adresse';
      }

      // Valider telefon (valgfritt)
      if (phone.trim() && !validatePhone(phone)) {
        newErrors.phone = 'Ugyldig telefonnummer';
      }

      // Valider postnummer
      if (!postalCode.trim()) {
        newErrors.postalCode = 'Postnummer er påkrevd';
      } else if (!validatePostalCode(postalCode)) {
        newErrors.postalCode = 'Postnummer må være 4 tall';
      }

      // Valider poststed
      if (!city.trim()) {
        newErrors.city = 'Poststed er påkrevd';
      }

      // Valider gateadresse
      if (!street.trim()) {
        newErrors.street = 'Gateadresse er påkrevd';
      }
    }

    setErrors(newErrors);

    // Hvis ingen feil, send skjema
    if (Object.keys(newErrors).length === 0) {
      const deliveryAddress = includeDeliveryAddress ? {
        street: street.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      } : undefined;
      onSubmit(customerName.trim(), deliveryAddress);
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

      {includeDeliveryAddress && (
        <>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Epost *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              placeholder="F.eks. kari@example.com"
              required
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.email
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-zinc-300 dark:border-zinc-700'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Telefonnummer
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) {
                  setErrors((prev) => ({ ...prev, phone: '' }));
                }
              }}
              placeholder="F.eks. +47 123 45 678"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>
            )}
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Valgfritt felt
            </p>
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Gateadresse *
            </label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => {
                setStreet(e.target.value);
                if (errors.street) {
                  setErrors((prev) => ({ ...prev, street: '' }));
                }
              }}
              placeholder="F.eks. Storgata 1"
              required
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.street
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-zinc-300 dark:border-zinc-700'
              }`}
            />
            {errors.street && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Postnummer *
              </label>
              <input
                id="postalCode"
                type="text"
                value={postalCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4); // Kun tall, maks 4
                  setPostalCode(value);
                  if (errors.postalCode) {
                    setErrors((prev) => ({ ...prev, postalCode: '' }));
                  }
                }}
                placeholder="F.eks. 0001"
                required
                disabled={isLoading}
                maxLength={4}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.postalCode
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-zinc-300 dark:border-zinc-700'
                }`}
              />
              {errors.postalCode && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.postalCode}</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Poststed *
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) {
                    setErrors((prev) => ({ ...prev, city: '' }));
                  }
                }}
                placeholder="F.eks. Oslo"
                required
                disabled={isLoading}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.city
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-zinc-300 dark:border-zinc-700'
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.city}</p>
              )}
            </div>
          </div>
        </>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={
            !customerName.trim() ||
            (includeDeliveryAddress &&
              (!email.trim() ||
                !street.trim() ||
                !postalCode.trim() ||
                !city.trim() ||
                !validateEmail(email) ||
                !validatePostalCode(postalCode))) ||
            isLoading
          }
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (loadingButtonText || 'Legger til...') : (submitButtonText || 'Legg til i handlekurv')}
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

