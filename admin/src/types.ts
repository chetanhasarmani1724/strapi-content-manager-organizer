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

export interface MenuContentTypeOption {
  uid: string;
  singularName: string;
  displayName: string;
  cleanDisplayName: string;
  kind: 'collectionType' | 'singleType';
}

export interface ConfigResponse {
  config: MenuOrganizerConfig;
}

export interface ContentTypesResponse {
  contentTypes: MenuContentTypeOption[];
  total: number;
}
