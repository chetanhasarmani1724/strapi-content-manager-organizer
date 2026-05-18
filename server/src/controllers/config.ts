import type { Core } from '@strapi/strapi';
const PLUGIN = 'content-manager-organizer';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getConfig(ctx: any) {
    const config = await strapi.plugin(PLUGIN).service('config').getConfig();

    ctx.body = {
      config,
    };
  },

  async saveConfig(ctx: any) {
    const config = await strapi.plugin(PLUGIN).service('config').saveConfig(ctx.request.body?.config);

    ctx.body = {
      config,
      success: true,
    };
  },
});
