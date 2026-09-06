'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

export interface PreloaderContextValue {
  /** True while the curtain is up. Flips once, on handover. */
  readonly isPreloading: boolean;
  /** Called by the preloader when its exit sequence finishes. */
  readonly finish: () => void;
}

const PreloaderContext = createContext<PreloaderContextValue | null>(null);

export interface PreloaderProviderProps {
  readonly children: ReactNode;
}

/**
 * Owns the one piece of preloader state anything else needs to know: whether
 * the curtain is still up.
 *
 * Progress deliberately does **not** live here. It changes every frame, and
 * routing that through React state would re-render the whole tree sixty times
 * a second to move two digits. The counter is written straight to its text
 * node from a GSAP tween instead — see `Preloader`.
 *
 * The provider also owns `inert`, because it is the thing that knows when the
 * page becomes interactive.
 */
export function PreloaderProvider({
  children,
}: PreloaderProviderProps): React.JSX.Element {
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  const finish = useCallback((): void => {
    setIsPreloading(false);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const targets = [
      document.querySelector<HTMLElement>('[data-site-header]'),
      document.getElementById('main'),
    ].filter((el): el is HTMLElement => el !== null);

    if (isPreloading) {
      targets.forEach((el) => {
        el.setAttribute('inert', '');
      });
      return;
    }

    targets.forEach((el) => {
      el.removeAttribute('inert');
    });
  }, [isPreloading]);

  const value = useMemo<PreloaderContextValue>(
    () => ({ isPreloading, finish }),
    [isPreloading, finish],
  );

  return (
    <PreloaderContext.Provider value={value}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader(): PreloaderContextValue {
  const ctx = useContext(PreloaderContext);
  return ctx ?? { isPreloading: false, finish: (): void => undefined };
}
