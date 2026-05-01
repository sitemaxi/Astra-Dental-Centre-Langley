const GA_ID = "G-P3XDSS2GYV";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function isAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function trackPageView(path: string, title?: string): void {
  if (!isAvailable()) return;
  window.gtag!("config", GA_ID, {
    page_path: path,
    page_title: title ?? document.title,
    anonymize_ip: true,
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!isAvailable()) return;
  window.gtag!("event", eventName, params);
}

export function trackFormSubmit(formName: string): void {
  trackEvent("form_submit", { form_name: formName });
}

export function trackCTAClick(label: string): void {
  trackEvent("cta_click", { label });
}
