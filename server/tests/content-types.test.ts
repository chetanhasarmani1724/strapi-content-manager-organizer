import { test } from 'node:test';
import assert from 'node:assert/strict';
import contentTypesService from '../src/services/content-types.ts';

const ct = (singularName: string, extra: Record<string, unknown> = {}) => ({
  kind: 'collectionType',
  info: { singularName, displayName: singularName },
  ...extra,
});

const run = (contentTypes: Record<string, unknown>) =>
  (contentTypesService({ strapi: { contentTypes } } as any) as any).getContentTypes();

test('excludes models with content-manager visible === false', () => {
  const result = run({
    'api::article.article': ct('article'),
    'api::secret.secret': ct('secret', { pluginOptions: { 'content-manager': { visible: false } } }),
    'plugin::foo.bar': ct('bar', { __schema__: { pluginOptions: { 'content-manager': { visible: false } } } }),
  });
  assert.deepEqual(result.map((r: any) => r.uid), ['api::article.article']);
});

test('excludes internal system plugins', () => {
  const result = run({
    'api::article.article': ct('article'),
    'plugin::i18n.locale': ct('locale'),
    'plugin::upload.file': ct('file'),
    'plugin::content-manager-organizer.content-manager-configuration': ct('content-manager-configuration'),
    'plugin::donations.donation': ct('donation'),
  });
  assert.deepEqual(result.map((r: any) => r.uid).sort(), ['api::article.article', 'plugin::donations.donation']);
});

test('qualifies singularName only when it is shared', () => {
  const result = run({
    'api::article.article': ct('article'),
    'plugin::donations.campaign': ct('campaign'),
    'plugin::broadcasts.campaign': ct('campaign'),
  });
  const names = Object.fromEntries(result.map((r: any) => [r.uid, r.singularName]));
  assert.equal(names['api::article.article'], 'article');
  assert.equal(names['plugin::donations.campaign'], 'donations.campaign');
  assert.equal(names['plugin::broadcasts.campaign'], 'broadcasts.campaign');
});
