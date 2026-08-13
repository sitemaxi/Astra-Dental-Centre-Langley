import type { JSX } from "react";

interface StoreLocatorElement extends HTMLElement {
  configureFromQuickBuilder: (config: unknown) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "gmpx-api-loader": JSX.IntrinsicElements["div"] & {
        key?: string;
        "solution-channel"?: string;
      };
      "gmpx-store-locator": JSX.IntrinsicElements["div"] & {
        "map-id"?: string;
        ref?: React.Ref<StoreLocatorElement>;
      };
    }
  }

  interface Window {
    gmpxStoreLocatorConfig?: unknown;
  }
}

export {};
