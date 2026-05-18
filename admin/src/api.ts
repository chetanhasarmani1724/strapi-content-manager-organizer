import { getFetchClient } from '@strapi/admin/strapi-admin';
import { PLUGIN_ID } from './pluginId';
import { DEFAULT_MENU_CONFIG } from './menu-config';
import type { ConfigResponse, ContentTypesResponse, MenuOrganizerConfig } from './types';

const baseUrl = `/${PLUGIN_ID}`;

function cloneDefaultConfig(): MenuOrganizerConfig {
  return JSON.parse(JSON.stringify(DEFAULT_MENU_CONFIG));
}

export async function fetchMenuConfig(): Promise<MenuOrganizerConfig> {
  try {
    const { get } = getFetchClient();
    const { data } = await get(`${baseUrl}/config`);
    const response = data as ConfigResponse;

    return response.config || cloneDefaultConfig();
  } catch {
    return cloneDefaultConfig();
  }
}

export async function saveMenuConfig(config: MenuOrganizerConfig): Promise<MenuOrganizerConfig> {
  const { put } = getFetchClient();
  const { data } = await put(`${baseUrl}/config`, { config });
  const response = data as ConfigResponse;

  return response.config;
}

export async function fetchMenuContentTypes() {
  const { get } = getFetchClient();
  const { data } = await get(`${baseUrl}/content-types`);
  const response = data as ContentTypesResponse;

  return response.contentTypes || [];
}
