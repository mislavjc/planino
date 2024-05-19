import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Auth } from './auth';

export const Navigation = () => {
  return (
    <div className="sticky top-0 bg-white">
      <div className="mx-auto max-w-screen-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/icon.png" alt="Planino" width={18} height={18} />
              <span className="text-lg font-semibold">Planino</span>
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="flex items-center gap-3">
                <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
              </div>
            }
          >
            <Auth />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
