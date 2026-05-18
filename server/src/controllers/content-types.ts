import type { Core } from '@strapi/strapi';
const PLUGIN = 'content-manager-organizer';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getContentTypes(ctx: any) {
    const contentTypes = await strapi.plugin(PLUGIN).service('contentTypes').getContentTypes();

    ctx.body = {
      contentTypes,
      total: contentTypes.length,
    };
  },
});
