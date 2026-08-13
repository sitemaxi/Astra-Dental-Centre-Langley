import { useEffect, useRef } from "react";

type StoreLocatorElement = HTMLElement & {
  configureFromQuickBuilder: (config: unknown) => void;
};

const MAPS_API_KEY = "AIzaSyBCtgjPD6wtgD32h9myfZsZhZCgHyI5cDs";

const CONFIGURATION = {
  locations: [
    {
      title: "Astra Dental Centre",
      address1: "Unit 120, 20061 Fraser Hwy",
      address2: "Langley, BC, Canada",
      coords: { lat: 49.1082904, lng: -122.6667404 },
      placeId: "ChIJh2At9NXPhVQRJy9YEHzoyK4",
    },
  ],
  mapOptions: {
    center: { lat: 49.1082904, lng: -122.6667404 },
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    zoom: 14,
    zoomControl: true,
    maxZoom: 17,
    mapId: "",
  },
  mapsApiKey: MAPS_API_KEY,
  capabilities: {
    input: false,
    autocomplete: false,
    directions: true,
    distanceMatrix: false,
    details: false,
    actions: false,
  },
};

const locatorStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const wrapperStyle = {
  "--gmpx-color-surface": "#fff",
  "--gmpx-color-on-surface": "#212121",
  "--gmpx-color-on-surface-variant": "#757575",
  "--gmpx-color-primary": "#0B3C5D",
  "--gmpx-color-outline": "#e0e0e0",
  "--gmpx-fixed-panel-width-row-layout": "28.5em",
  "--gmpx-fixed-panel-height-column-layout": "65%",
  "--gmpx-font-family-base": "'Inter', sans-serif",
  "--gmpx-font-family-headings": "'Poppins', sans-serif",
  "--gmpx-font-size-base": "0.875rem",
  "--gmpx-hours-color-open": "#0A7A70",
  "--gmpx-hours-color-closed": "#d50000",
  "--gmpx-rating-color": "#ffb300",
  "--gmpx-rating-color-empty": "#e0e0e0",
} as React.CSSProperties;

export default function StoreLocator() {
  const locatorRef = useRef<StoreLocatorElement>(null);

  useEffect(() => {
    const configure = async () => {
      await customElements.whenDefined("gmpx-store-locator");
      const locator = locatorRef.current;
      if (locator) {
        locator.configureFromQuickBuilder(CONFIGURATION);
      }
    };
    configure();
  }, []);

  return (
    <div
      className="w-full overflow-hidden rounded-3xl border border-gray-200 shadow-card bg-white"
      style={wrapperStyle}
    >
      <gmpx-api-loader
        key={MAPS_API_KEY}
        solution-channel="GMP_QB_locatorplus_v11_c"
      />
      <gmpx-store-locator
        ref={locatorRef}
        map-id="DEMO_MAP_ID"
        style={locatorStyle}
      />
    </div>
  );
}
