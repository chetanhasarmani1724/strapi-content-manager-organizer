import register from './register';
import bootstrap from './bootstrap';
import destroy from './destroy';
import controllers from './controllers';
import routes from './routes';
import services from './services';

const menuConfigurationSchema = {
  kind: 'collectionType',
  collectionName: 'content_manager_organizer_configurations',
  info: {
    singularName: 'content-manager-configuration',
    pluralName: 'content-manager-configurations',
    displayName: 'Content Manager Configuration',
    description: 'Stores the Content Manager configuration',
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    'content-manager': {
      visible: false,
    },
    'content-type-builder': {
      visible: false,
    },
  },
  attributes: {
    key: {
      type: 'string',
      required: true,
      unique: true,
      configurable: false,
    },
    config: {
      type: 'json',
      required: true,
      configurable: false,
    },
  },
};

export default {
  register,
  bootstrap,
  destroy,
  controllers,
  routes,
  services,
  contentTypes: {
    'content-manager-configuration': {
      schema: menuConfigurationSchema,
    },
  },
};
