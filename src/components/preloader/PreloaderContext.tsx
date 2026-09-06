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

  /**
   * Hold the page inert behind the curtain.
   *
   * Applied imperatively rather than as a React prop, and that is deliberate:
   * rendering `inert` into the server HTML would leave the whole site
   * permanently inert for anyone whose JavaScript never arrives, since nothing
   * would ever run to take it off. Setting it from an effect means no-JS
   * visitors get a plain, fully interactive page — which is also why the
   * overlay's own covering styles are gated on `html.js`.
   *
   * The header and <main> are separate targets because the header renders
   * outside <main>. The mobile menu is `hidden` while closed, so it needs
   * nothing here.
   */
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

/**
 * Read preloader state. Safe outside the provider — reports "not preloading",
 * which is the correct answer for any tree that has no curtain over it.
 */
export function usePreloader(): PreloaderContextValue {
  const ctx = useContext(PreloaderContext);
  return ctx ?? { isPreloading: false, finish: (): void => undefined };
}
