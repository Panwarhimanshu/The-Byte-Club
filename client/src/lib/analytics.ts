/**
 * Analytics shim. No network calls until a real provider is wired in.
 * Swap `sink` for GA4 / PostHog / Plausible later without touching call sites.
 */
type AnalyticsEvent =
  | 'view_home'
  | 'view_menu'
  | 'view_product'
  | 'view_offers'
  | 'search'
  | 'find_us_click'
  | 'delivery_app_click';

const DEBUG = import.meta.env.DEV;

function sink(event: AnalyticsEvent, payload?: Record<string, unknown>) {
  if (DEBUG) {

    console.debug(`[analytics] ${event}`, payload ?? {});
  }
  // window.gtag?.('event', event, payload);
}

export const track = (event: AnalyticsEvent, payload?: Record<string, unknown>) =>
  sink(event, payload);
