import type { Core } from '@strapi/strapi';

function stripPrefix(text: string) {
  return text.replace(/^\d{1,3}\s+/, '');
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getContentTypes() {
    return Object.entries(strapi.contentTypes)
      .filter(([uid, schema]: [string, any]) =>
        (uid.startsWith('api::') || (uid.startsWith('plugin::') && uid !== 'plugin::content-manager-organizer.content-manager-configuration')) &&
        (schema.kind === 'collectionType' || schema.kind === 'singleType')
      )
      .map(([uid, schema]: [string, any]) => {
        const singularName = schema.info?.singularName || uid.match(/(?:api|plugin)::[^.]+\.([^/&#?]+)/)?.[1] || uid;
        const displayName = schema.info?.displayName || singularName;

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
