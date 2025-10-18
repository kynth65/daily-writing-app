'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Quick fade-in on route change - no artificial delay
    setIsVisible(false);
    // Use requestAnimationFrame for immediate, smooth transition
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-100 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
