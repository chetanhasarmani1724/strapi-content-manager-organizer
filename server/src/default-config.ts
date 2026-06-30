export interface MenuGroup {
  id: string;
  label: string;
  defaultExpanded: boolean;
  kind?: 'collectionType' | 'singleType';
  items: string[];
}

export interface MenuOrganizerConfig {
  stripNumericPrefix: boolean;
  sortBy?: 'alphabetical' | 'custom';
  groups: MenuGroup[];
}

export const DEFAULT_MENU_CONFIG: MenuOrganizerConfig = {
  stripNumericPrefix: false,
  sortBy: 'alphabetical',
  groups: [],
};