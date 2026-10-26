import { PLUGIN_ID } from './pluginId';
import { setupMenuOrganizer } from './organizer';
import { getTrad } from './utils/getTrad';
import en from './translations/en.json';
import es from './translations/es.json';
import ar from './translations/ar.json';
import tr from './translations/tr.json';

const TRANSLATIONS: Record<string, Record<string, string>> = { en, es, ar, tr };

function prefixTranslations(data: Record<string, string>) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [getTrad(key), value]));
}

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      name: 'Content Manager Organizer',
    });

    app.addSettingsLink('global', {
      id: PLUGIN_ID,
      intlLabel: {
        id: getTrad('settings.label'),
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
    return locales.map((locale) => ({
      data: prefixTranslations(TRANSLATIONS[locale] ?? {}),
      locale,
    }));
  },
};
