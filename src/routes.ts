export type RouteMeta = {
  title: string;
  description: string;
  robots?: string;
};

/**
 * The complete SPA route inventory. Routes without an entry are rendered as
 * the missing-page route.
 */
export const routeMeta: Record<string, RouteMeta> = {
  '/': { title: 'Flex Meal Templates — Adjust meal portions', description: 'Adjust meal portions, compare them with saved nutrition ranges, and log them without changing the meal template.' },
  '/app': { title: 'Your meals — Flex Meal Templates', description: 'Save meal templates, adjust today’s portions, and compare nutrition with each meal’s ranges.', robots: 'noindex' },
  '/demo': { title: 'Demo — Flex Meal Templates', description: 'Try two sample meal templates and one earlier log without changing your records.', robots: 'noindex' },
  '/app/new': { title: 'New meal — Flex Meal Templates', description: 'Create a meal template with ingredients and custom nutrition ranges.', robots: 'noindex' },
  '/app/edit': { title: 'Edit meal — Flex Meal Templates', description: 'Edit a meal template, its ingredients, and its nutrition ranges.', robots: 'noindex' },
  '/demo/new': { title: 'New sample meal — Flex Meal Templates', description: 'Add a meal template to the separate sample workspace.', robots: 'noindex' },
  '/demo/edit': { title: 'Edit sample meal — Flex Meal Templates', description: 'Edit a meal template in the separate sample workspace.', robots: 'noindex' },
  '/privacy': { title: 'Privacy — Flex Meal Templates', description: 'Read how Flex Meal Templates stores meal records in your browser and keeps demo data separate.' },
  '/terms': { title: 'Terms — Flex Meal Templates', description: 'Read the terms for using Flex Meal Templates as a personal meal-recording utility.' },
  '/404': { title: 'Page not found — Flex Meal Templates', description: 'This Flex Meal Templates page could not be found.', robots: 'noindex' }
};

/**
 * These paths are deliberately absent from the sitemap: edit routes require
 * an id query, and 404/offline documents are fallback documents, not places
 * a crawler should discover.
 */
export const nonSitemapRoutePaths = ['/app/edit', '/demo/edit', '/404', '/offline'] as const;

export const stableRoutePaths = Object.keys(routeMeta).filter(
  (path) => !nonSitemapRoutePaths.includes(path as (typeof nonSitemapRoutePaths)[number])
);
