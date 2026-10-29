import { copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { locations } from './src/data/locations';
import { serviceCategories } from './src/data/services';

const LEGACY_REDIRECTS: Array<[string, string]> = [
  ['/general-dentistry/crowns/', '/prosthodontics/crowns/'],
  ['/general-dentistry/bridges/', '/prosthodontics/bridges/'],
  ['/general-dentistry/white-fillings/', '/general-dentistry/composite-fillings/'],
  ['/oral-surgery/root-amputation/', '/endodontics/root-amputation/'],
  ['/childrens-dentistry/childrens-dentistry/', '/langley-dental-services/childrens-dentistry/'],
  ['/gum-surgery/gum-surgery/', '/periodontics/gum-surgery/'],
  ['/periodontics/periodontics/', '/langley-dental-services/periodontics/'],
  ['/prosthodontics/prosthodontics/', '/langley-dental-services/prosthodontics/'],
];

const STATIC_ROUTES = [
  '/',
  '/about-the-dentist/',
  '/contact-us/',
  '/blog/',
  '/blog/*',
  '/patient-info/new-patient-form/',
  '/terms-and-conditions/',
  '/privacy-policy/',
  '/thankyou/',
  '/langley-dental-services/',
  '/langley-dental-services/dental-implants-langley/',
  '/admin',
  '/admin/*',
];

export function spaRoutes(): string[] {
  const routes = [
    ...STATIC_ROUTES,
    ...serviceCategories.map((c) => `/langley-dental-services/${c.slug}/`),
    ...serviceCategories.flatMap((c) => c.services.map((s) => `/${c.slug}/${s.slug}/`)),
    ...locations.map((l) => `/${l.slug}/`),
  ];
  return [...new Set(routes)];
}

export function spaRoutesPlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'spa-routes',
    apply: 'build',
    configResolved(resolved) {
      config = resolved;
    },
    closeBundle() {
      const outDir = resolve(config.root, config.build.outDir);
      const lines = [
        '# Generated at build time from the app route data. Do not edit by hand.',
        ...LEGACY_REDIRECTS.map(([from, to]) => `${from}  ${to}  301`),
        ...spaRoutes().map((route) => `${route}  /index.html  200`),
        '/*  /404.html  404',
        '',
      ];
      writeFileSync(resolve(outDir, '_redirects'), lines.join('\n'));
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
}
