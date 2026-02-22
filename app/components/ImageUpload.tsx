'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export interface ImageUploadProps {
  requiredCount: number;
  onConfirm?: (imageUrls: string[]) => void;
}

export default function ImageUpload({ requiredCount, onConfirm }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadSingleFile = async (file: File, index: number): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Kun bilder er tillatt');
    }

    // Valider filstørrelse (4.5 MB limit for server uploads)
    const maxSize = 4.5 * 1024 * 1024; // 4.5 MB
    if (file.size > maxSize) {
      throw new Error('Filen er for stor. Maksimal størrelse er 4.5 MB.');
    }

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Kunne ikke laste opp bildet');
    }

    const data = await response.json();
    return data.url;
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Sjekk at vi ikke har for mange filer
    if (uploadedImages.length + fileArray.length > requiredCount) {
      setError(`Du kan bare laste opp ${requiredCount} bilder totalt. Du har allerede lastet opp ${uploadedImages.length}.`);
      return;
    }

    // Filtrer kun bilder
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== fileArray.length) {
      setError('Noen filer er ikke bilder og ble hoppet over.');
    }

    if (imageFiles.length === 0) {
      setError('Ingen gyldige bilder funnet.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = imageFiles.map((file, index) => 
        uploadSingleFile(file, uploadedImages.length + index)
      );

      const urls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'En feil oppstod');
    } finally {
      setUploading(false);
      setUploadingIndex(null);
    }
  };

  const handleFile = async (file: File) => {
    const files = new DataTransfer();
    files.items.add(file);
    await handleFiles(files.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setError(null);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          multiple
          className="hidden"
          disabled={uploading}
        />
        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <button
              type="button"
              onClick={onButtonClick}
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading 
                ? `Laster opp... (${uploadedImages.length}/${requiredCount})`
                : `Velg bilder (${uploadedImages.length}/${requiredCount})`
              }
            </button>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              eller dra og slipp bilder her (du kan velge flere samtidig)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Opplastede bilder
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              uploadedImages.length >= requiredCount
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
            }`}>
              {uploadedImages.length} / {requiredCount} bilder
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 group cursor-pointer"
              >
                <Image
                  src={url}
                  alt={`Magnet bilde ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {uploadingIndex === index && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-sm">Laster opp...</div>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
                {/* Hover overlay with trash can icon */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label="Fjern bilde"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {uploadedImages.length >= requiredCount && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                    ✓ Alle {requiredCount} bilder er lastet opp!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Sjekk at alle bildene er korrekte før du går videre.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onConfirm && uploadedImages.length === requiredCount) {
                      onConfirm(uploadedImages);
                    }
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Bekreft og gå videre
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

