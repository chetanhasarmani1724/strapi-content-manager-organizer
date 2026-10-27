import type { Core } from '@strapi/strapi';

const EXCLUDED_PLUGINS = new Set([
  'upload',
  'i18n',
  'content-releases',
  'review-workflows',
  'content-manager-organizer',
  'cloud',
  'seo',
  'navigation',
  'publisher',
  'notes',
  'email-designer-5',
  'strapi-5-sitemap-plugin',
]);

function stripPrefix(text: string) {
  return text.replace(/^\d{1,3}\s+/, '');
}

function parseUid(uid: string) {
  const match = uid.match(/^(api|plugin)::([^.]+)\.(.+)$/);
  return match ? { scope: match[1], prefix: match[2], name: match[3] } : null;
}

function isHidden(schema: any) {
  return (
    schema?.pluginOptions?.['content-manager']?.visible === false ||
    schema?.__schema__?.pluginOptions?.['content-manager']?.visible === false
  );
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getContentTypes() {
    const visible = Object.entries(strapi.contentTypes).filter(([uid, schema]: [string, any]) => {
      const parsed = parseUid(uid);
      if (!parsed) return false;
      if (parsed.scope === 'plugin' && EXCLUDED_PLUGINS.has(parsed.prefix)) return false;
      if (isHidden(schema)) return false;
      return schema.kind === 'collectionType' || schema.kind === 'singleType';
    });

    const nameOf = ([uid, schema]: [string, any]) =>
      schema.info?.singularName || parseUid(uid)?.name || uid;

    const counts = new Map<string, number>();
    for (const entry of visible) {
      counts.set(nameOf(entry), (counts.get(nameOf(entry)) ?? 0) + 1);
    }

    return visible
      .map((entry) => {
        const [uid, schema] = entry as [string, any];
        const baseName = nameOf(entry);
        const prefix = parseUid(uid)!.prefix;
        // Qualify names shared by several content types so they can be told apart.
        const singularName = (counts.get(baseName) ?? 0) > 1 ? `${prefix}.${baseName}` : baseName;
        const displayName = schema.info?.displayName || baseName;

        return {
          uid,
          singularName,
          displayName,
          cleanDisplayName: stripPrefix(displayName),
          kind: schema.kind as 'collectionType' | 'singleType',
        };
      })
      .sort((a, b) => a.cleanDisplayName.localeCompare(b.cleanDisplayName));
  },
});
