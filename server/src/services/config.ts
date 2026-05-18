import type { Core } from '@strapi/strapi';
import { DEFAULT_MENU_CONFIG, type MenuOrganizerConfig } from '../default-config';

const CONFIG_KEY = 'main';
const UID = 'plugin::content-manager-organizer.content-manager-configuration';

function cloneDefaultConfig(): MenuOrganizerConfig {
  return JSON.parse(JSON.stringify(DEFAULT_MENU_CONFIG));
}

function normalizeId(value: string, existing: Set<string>) {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'group';

  let id = base;
  let index = 2;

  while (existing.has(id)) {
    id = `${base}-${index}`;
    index += 1;
  }

  existing.add(id);
  return id;
}

function normalizeConfig(input: Partial<MenuOrganizerConfig> | null | undefined): MenuOrganizerConfig {
  const existingIds = new Set<string>();
  const seenItems = new Set<string>();
  const groups = Array.isArray(input?.groups) ? input!.groups : [];

  return {
    stripNumericPrefix: input?.stripNumericPrefix !== false,
    groups: groups
      .map((group) => {
        const label = typeof group.label === 'string' && group.label.trim() ? group.label.trim() : 'Group';
        const id = normalizeId(typeof group.id === 'string' && group.id.trim() ? group.id : label, existingIds);
        const items = Array.isArray(group.items)
          ? group.items
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => item.trim())
            .filter((item) => {
              if (seenItems.has(item)) return false;
              seenItems.add(item);
              return true;
            })
          : [];

        return {
          id,
          label,
          defaultExpanded: group.defaultExpanded === true,
          items,
        };
      })
      .filter((group) => group.label.length > 0),
  };
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getConfig(): Promise<MenuOrganizerConfig> {
    const result = await strapi.db.query(UID).findOne({
      where: { key: CONFIG_KEY },
    });

    if (!result?.config) {
      return cloneDefaultConfig();
    }

    return normalizeConfig(result.config as MenuOrganizerConfig);
  },

  async saveConfig(config: MenuOrganizerConfig): Promise<MenuOrganizerConfig> {
    const normalized = normalizeConfig(config);
    const existing = await strapi.db.query(UID).findOne({
      where: { key: CONFIG_KEY },
    });

    if (existing) {
      await strapi.db.query(UID).update({
        where: { id: existing.id },
        data: {
          config: normalized,
        },
      });
    } else {
      await strapi.db.query(UID).create({
        data: {
          key: CONFIG_KEY,
          config: normalized,
        },
      });
    }

    return normalized;
  },
});
