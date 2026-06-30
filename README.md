# strapi-plugin-content-manager-organizer

<div align="center">

[![npm version](https://img.shields.io/npm/v/strapi-plugin-content-manager-organizer.svg?style=flat-square)](https://www.npmjs.com/package/strapi-plugin-content-manager-organizer)
[![npm downloads](https://img.shields.io/npm/dm/strapi-plugin-content-manager-organizer.svg?style=flat-square)](https://www.npmjs.com/package/strapi-plugin-content-manager-organizer)
[![Strapi version](https://img.shields.io/badge/strapi-v5-blue?style=flat-square)](https://strapi.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)


A **Strapi v5** plugin that lets you organize the Content Manager 
sidebar into **collapsible, labeled groups** — configured entirely 
through a brand new visual Settings UI with Drag & Drop.

![Content Manager Organizer Demo](/.github/demo/mo-demo.mp4)

</div>

---

## 🚀 What's New in v2!

We've completely overhauled the plugin with a ton of new features and quality-of-life improvements:

- 🎨 **Brand New UI Dashboard**: A completely redesigned, settings dashboard.
- 🖱️ **Drag & Drop Ordering**: Visually re-arrange your content types and groups with smooth drag-and-drop mechanics.
- 📑 **Single Types Support**: You can now organize your **Single Types** into groups! Collection Types and Single Types are cleanly separated in the dashboard.
- 🔀 **Sort Orders**: Choose exactly how your sidebar renders:
  - **Alphabetical (Default)**: Automatically sorts groups and items alphabetically.
  - **Custom Order**: Respects the exact drag-and-drop order you set in the dashboard.
- 🔍 **Enhanced Search**: Quickly find and filter your content types within the settings dashboard.

---

## 🎯 Why Content Manager Organizer?
 
When your Strapi project grows to **20, 30, or 50+ content types**, 
the default sidebar becomes a long, unmanageable list. 
**Content Manager Organizer** solves this by letting you:
 
| Problem | Solution |
|---------|----------|
| 50+ content types in one list | Group into logical sections |
| Alphabetical order not useful | Custom drag-and-drop ordering within groups |
| Can't find content types fast | Collapse irrelevant groups |
| Single types cluttering sidebar | Group them separately |
| Config lost on redeploy | Saved safely to the database |
 
---
 
## Screenshots
 
### Interactive Drag & Drop Dashboard
![Dashboard](/.github/images/cmo-light-theme-dashboard.png)
 
### Collection vs Single Types Separation
![SingleType](/.github/images/com-single-types.png)
 
### Grouped Sidebar — Dark Mode
![GroupedSidebar](/.github/images/cmo-runtime-overlay.png)

 
---
 
## ✨ Features
 
- 📁 **Group content types** into named, collapsible sections
- 📄 **Single Types support** — organize Collection Types and Single Types separately
- 🖱️ **Drag & Drop** — re-arrange groups and items visually
- 🔀 **Custom Sort Orders** — choose between Alphabetical or Custom ordering
- 🔍 **Real-time Search** — instantly filter content types in the settings
- 💾 **Persisted to database** — survives redeploys (SQLite, PostgreSQL, MySQL)
- 🌙 **Dark/Light theme** — auto-detects Strapi theme perfectly
- ⚡ **Zero config required** — works out of the box
- 🎛️ **Visual Settings UI** — no code changes needed
 
---
 
## 📦 Installation
 
### npm
```bash
npm install strapi-plugin-content-manager-organizer
```
 
### yarn
```bash
yarn add strapi-plugin-content-manager-organizer
```
 
### pnpm
```bash
pnpm add strapi-plugin-content-manager-organizer
```
 
---
 
## 🎛️ How It Works
 
```
┌─────────────────────────────────────────────────┐
│  First launch (no config in DB)                 │
│  → Shows default Strapi sidebar order           │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│  User configures via Settings > Content Manager Organizer  │
│  → Config saved to database                     │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│  Every subsequent visit                         │
│  → DB config loaded → grouped sidebar shown     │
│  → Survives redeploys ✓                         │
└─────────────────────────────────────────────────┘
```
 
### Database Storage
 
The plugin creates a **hidden content type** `content-manager-configuration` 
that stores your config as JSON. It's hidden from the Content Manager 
and Content-Type Builder — you'll never accidentally see it.
 
```
plugin::content-manager-organizer.content-manager-configuration
├── key: "main"          (always "main", one record)
└── config: { ... }      (your full group config as JSON)
```
 
### Supported Databases
 
| Database | Supported |
|----------|-----------|
| SQLite | ✅ Yes |
| PostgreSQL | ✅ Yes |
| MySQL | ✅ Yes |
| MariaDB | ✅ Yes |
 
---
 
## 📋 Settings Page Reference
 
### Tabs
Switch between **Collection Types** and **Single Types** to manage them independently.

### Sort Order Toggle
- **Alphabetical**: Automatically sorts your sidebar groups and items alphabetically.
- **Custom Order**: Respects the exact drag-and-drop order from the dashboard.

### Drag & Drop Interface
- **Create Groups**: Click the "New Group" button to create a section.
- **Drag Items**: Drag content types from the left panel into any group on the right.
- **Reorder Items**: Drag items up and down within a group.
- **Reorder Groups**: Drag entire groups up and down to change their order in the sidebar.
 
---
 
## 🔐 Permissions
 
The plugin registers two permissions under **Plugins → Content Manager Organizer**:
 
| Permission | Description |
|------------|-------------|
| `settings.read` | View the settings page |
| `settings.update` | Save configuration changes |
 
Assign these in **Settings → Roles** to control who can configure the plugin.
 
---
 
## 🛠️ Advanced: Pre-seeding Config via Code
 
If you want to ship a **default config** for your team 
(without UI configuration), you can seed the database on bootstrap:
 
```typescript
// src/index.ts (your Strapi project, not the plugin)
export default {
  async bootstrap({ strapi }) {
    // Only seed if no config exists
    const existing = await strapi.db
      .query('plugin::content-manager-organizer.content-manager-configuration')
      .findOne({ where: { key: 'main' } });
 
    if (!existing) {
      await strapi.db
        .query('plugin::content-manager-organizer.content-manager-configuration')
        .create({
          data: {
            key: 'main',
            config: {
              stripNumericPrefix: true,
              sortBy: 'alphabetical',
              groups: [
                {
                  id: 'products',
                  label: 'Products',
                  defaultExpanded: true,
                  kind: 'collectionType',
                  items: ['product', 'category'],
                },
                {
                  id: 'blog',
                  label: 'Blog',
                  defaultExpanded: false,
                  kind: 'collectionType',
                  items: ['article', 'tag', 'author'],
                },
                {
                  id: 'settings',
                  label: 'Global Settings',
                  defaultExpanded: true,
                  kind: 'singleType',
                  items: ['site-config', 'footer'],
                }
              ],
            },
          },
        });
    }
  },
};
```
 
---
 
## 📄 License
 
MIT © [Chetan Hasarmani](https://github.com/chetanhasarmani1724)
 
## 🙏 Acknowledgements
 
Built with [Strapi Plugin SDK](https://docs.strapi.io/dev-docs/plugins/development/create-a-plugin) 
and [Strapi Design System](https://design-system.strapi.io/).
