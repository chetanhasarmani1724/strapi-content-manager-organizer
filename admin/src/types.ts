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

export interface MenuContentTypeOption {
  uid: string;
  singularName: string;
  displayName: string;
  cleanDisplayName: string;
}

export interface ConfigResponse {
  config: MenuOrganizerConfig;
}

export interface ContentTypesResponse {
  contentTypes: MenuContentTypeOption[];
  total: number;
}
