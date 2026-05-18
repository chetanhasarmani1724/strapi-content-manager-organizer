import type { Core } from '@strapi/strapi';

function stripPrefix(text: string) {
  return text.replace(/^\d{1,3}\s+/, '');
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getContentTypes() {
    return Object.entries(strapi.contentTypes)
      .filter(([uid, schema]: [string, any]) => uid.startsWith('api::') && schema.kind === 'collectionType')
      .map(([uid, schema]: [string, any]) => {
        const singularName = schema.info?.singularName || uid.match(/^api::([^.]+)\./)?.[1] || uid;
        const displayName = schema.info?.displayName || singularName;

        return {
          uid,
          singularName,
          displayName,
          cleanDisplayName: stripPrefix(displayName),
        };
      })
      .sort((a, b) => a.cleanDisplayName.localeCompare(b.cleanDisplayName));
  },
});
