import type { MenuOrganizerConfig } from './types';

/**
 * Client-side fallback config.
 *
 * Used ONLY if the API call to fetch config fails entirely.
 * When empty groups, the sidebar shows Strapi's default order.
 * Real config always comes from the database via the API.
 */
export const DEFAULT_MENU_CONFIG: MenuOrganizerConfig = {
  stripNumericPrefix: false,
  groups: [],
};