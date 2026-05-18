import type { Core } from '@strapi/strapi';

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Read Content Manager Organizer Settings',
      uid: 'settings.read',
      pluginName: 'content-manager-organizer',
    },
    {
      section: 'plugins',
      displayName: 'Update Content Manager Organizer Settings',
      uid: 'settings.update',
      pluginName: 'content-manager-organizer',
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};