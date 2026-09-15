import { router, type Href } from 'expo-router';

/**
 * Goes back in history if there is any, otherwise replaces with `fallback`.
 * Plain `router.back()` silently does nothing when a screen was reached via a
 * deep link (no history) — this guarantees the user always lands somewhere sane.
 */
export function backOr(fallback: Href) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
