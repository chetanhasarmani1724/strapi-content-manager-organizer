export interface MenuGroup {
  id: string;
  label: string;
  defaultExpanded: boolean;
  items: string[];
}

export interface MenuOrganizerConfig {
  stripNumericPrefix: boolean;
  groups: MenuGroup[];
}

/**
 * Default config is intentionally empty.
 *
 * When no configuration has been saved yet via the Settings UI,
 * the plugin will not reorganize the sidebar — Strapi's default
 * alphabetical order will be shown.
 *
 * Once the user saves a config via:
 * Settings → Content Manager Organizer
 * it is stored in the database and applied on every visit.
 */
export const DEFAULT_MENU_CONFIG: MenuOrganizerConfig = {
  stripNumericPrefix: false,
  groups: [],
};