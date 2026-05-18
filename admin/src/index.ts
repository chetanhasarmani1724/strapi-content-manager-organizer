import { PLUGIN_ID } from './pluginId';
import { setupMenuOrganizer } from './organizer';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      name: 'Content Manager Organizer',
    });

    app.addSettingsLink('global', {
      id: PLUGIN_ID,
      intlLabel: {
        id: `${PLUGIN_ID}.settings.label`,
        defaultMessage: 'Content Manager Organizer',
      },
      to: PLUGIN_ID,
      Component: () => import('./pages/SettingsPage'),
      permissions: [
        {
          action: `plugin::${PLUGIN_ID}.settings.update`,
          subject: null,
        },
      ],
    });
  },

  bootstrap(_app: any) {
    setupMenuOrganizer();
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return locales.map((locale) => ({ data: {}, locale }));
  },
};
