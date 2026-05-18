const PLUGIN = 'content-manager-organizer';

const readPolicy = {
  name: 'admin::hasPermissions',
  config: {
    actions: [`plugin::${PLUGIN}.settings.read`],
  },
};

const updatePolicy = {
  name: 'admin::hasPermissions',
  config: {
    actions: [`plugin::${PLUGIN}.settings.update`],
  },
};

export default {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/config',
        handler: 'config.getConfig',
        config: {
          policies: ['admin::isAuthenticatedAdmin', readPolicy],
        },
      },
      {
        method: 'PUT',
        path: '/config',
        handler: 'config.saveConfig',
        config: {
          policies: ['admin::isAuthenticatedAdmin', updatePolicy],
        },
      },
      {
        method: 'GET',
        path: '/content-types',
        handler: 'contentTypes.getContentTypes',
        config: {
          policies: ['admin::isAuthenticatedAdmin', updatePolicy],
        },
      },
    ],
  },
};
