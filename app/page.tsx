import ImageUpload from './components/ImageUpload';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center py-16 px-4 sm:px-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Bildeopplasting
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Last opp bilder til Vercel Blob
            </p>
          </div>
          <ImageUpload />
        </div>
      </main>
    </div>
  );
}
