# strapi-plugin-content-manager-organizer

<div align="center">

[![npm version](https://img.shields.io/npm/v/strapi-plugin-content-manager-organizer.svg?style=flat-square)](https://www.npmjs.com/package/strapi-plugin-content-manager-organizer)
[![npm downloads](https://img.shields.io/npm/dm/strapi-plugin-content-manager-organizer.svg?style=flat-square)](https://www.npmjs.com/package/strapi-plugin-content-manager-organizer)
[![Strapi version](https://img.shields.io/badge/strapi-v5-blue?style=flat-square)](https://strapi.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/strapi-plugin-content-manager-organizer?style=flat-square)](https://github.com/yourusername/strapi-plugin-content-manager-organizer)

A **Strapi v5** plugin that lets you organize the Content Manager 
sidebar into **collapsible, labeled groups** — configured entirely 
through a visual Settings UI with no code changes required.

![Content Manager Organizer Demo](./docs/demo.gif)

</div>

---

## 🎯 Why Content Manager Organizer?

When your Strapi project grows to **20, 30, or 50+ content types**, 
the default sidebar becomes a long, unmanageable list. 
**Content Manager Organizer** solves this by letting you:

| Problem | Solution |
|---------|----------|
| 50+ content types in one list | Group into logical sections |
| Alphabetical order not useful | Custom ordering within groups |
| Can't find content types fast | Collapse irrelevant groups |
| Numeric prefixes cluttering names | Auto-strip numeric prefixes |
| Config lost on redeploy | Saved to database |

---

## Screenshots

### Plugin in Settings
![Settings](/.github/images/settings.page.png)

### Configure Groups
![Configure](/.github/images/content.manager.page.dark.png)

### Grouped Sidebar — Dark Mode
![Dark](/.github/images/content.manager.page.light.png)

---

## ✨ Features

- 📁 **Group content types** into named, collapsible sections
- 🔢 **Custom ordering** — drag items up/down within groups
- 🔍 **Strip numeric prefixes** — hide `01 Product` → show `Product`
- 💾 **Persisted to database** — survives redeploys (SQLite, PostgreSQL, MySQL)
- 🌙 **Dark/Light theme** — auto-detects Strapi theme
- ♿ **Accessible** — ARIA attributes on all interactive elements
- ⚡ **Zero config required** — works out of the box
- 🎛️ **Visual Settings UI** — no code changes needed

---

## 📸 Screenshots

### Organized Sidebar
![Organized sidebar with groups](./docs/sidebar-organized.png)

### Settings Page
![Settings page](./docs/settings-page.png)

---

## 🚀 Installation

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

## ⚙️ Setup

### Step 1 — Enable the plugin

Add to your `config/plugins.ts` (or `config/plugins.js`):

```typescript
// config/plugins.ts
export default () => ({
  'content-manager-organizer': {
    enabled: true,
  },
});
```

### Step 2 — Rebuild Strapi admin

```bash
npm run build
npm run develop
```

### Step 3 — Configure via UI

1. Open Strapi admin
2. Go to ⚙️ **Settings** → **Content Manager Organizer**
3. Click **Add group**
4. Name the group (e.g., `Products`)
5. Add content types from the **Ungrouped** panel
6. Click **Save**

The sidebar updates **immediately** — no restart needed!

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

### Groups Panel

| Control | Description |
|---------|-------------|
| Group name input | Rename the group |
| ↑ ↓ arrows | Reorder groups |
| 🗑️ trash | Delete group |
| Expanded by default | Whether group starts open |
| ↑ ↓ on items | Reorder items within group |
| 🗑️ on items | Remove item from group |
| Add content type | Dropdown of ungrouped types |

### Ungrouped Panel

Shows all content types **not yet assigned** to any group. 
These still appear in the sidebar under an **"Other"** group at the bottom.

### Strip Numeric Prefixes

When enabled, removes leading numbers from display names:
```
Before: "01 Product"     → After: "Product"
Before: "10 Asset Tag"   → After: "Asset Tag"
```
Useful if you prefix content types for Strapi's default ordering.

---

## 🔐 Permissions

The plugin registers two permissions under **Plugins → Content Manager Organizer**:

| Permission | Description |
|------------|-------------|
| `settings.read` | View the settings page |
| `settings.update` | Save configuration changes |

Assign these in **Settings → Roles** to control who can configure the plugin.

---

## 🔄 Config Lifecycle

```
Admin visits Content Manager
         │
         ▼
Plugin fetches config from API
         │
    ┌────┴────┐
    │DB has   │ Yes → Use DB config → Group sidebar
    │config?  │
    └────┬────┘
         │ No
         ▼
Use empty default → Show normal Strapi sidebar
         │
         ▼
Admin goes to Settings → Content Manager Organizer
         │
         ▼
Creates groups, assigns content types, saves
         │
         ▼
Config saved to DB → Sidebar updates instantly
         │
         ▼
Next time any admin visits → DB config used ✓
```

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
              groups: [
                {
                  id: 'products',
                  label: 'Products',
                  defaultExpanded: true,
                  items: ['product', 'category'],
                },
                {
                  id: 'blog',
                  label: 'Blog',
                  defaultExpanded: false,
                  items: ['article', 'tag', 'author'],
                },
              ],
            },
          },
        });
    }
  },
};
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Quick Start for Contributors

```bash
# 1. Fork & clone
git clone https://github.com/yourusername/strapi-plugin-content-manager-organizer
cd strapi-plugin-content-manager-organizer

# 2. Install dependencies
npm install

# 3. Link to your Strapi project for development
npm run watch:link

# In your Strapi project:
npm run develop
```

### Roadmap / Good First Issues

We’re incredibly proud of how Content Manager Organizer has simplified the Strapi Content Manager experience so far, but we’re far more excited by the features and enhancements that lie ahead.

- [ ] 🖱️ Drag & drop reordering (instead of arrows)
- [ ] 🎨 Custom color per group
- [ ] 🔍 Search bar in Settings page
- [ ] 📤 Export/Import config as JSON
- [ ] 🌍 i18n translations
- [ ] 📱 Better mobile responsive settings

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md)

---

## 📄 License

MIT © [Chetan Hasarmani](https://github.com/chetanhasarmani1724)

---

## 🙏 Acknowledgements

Built with [Strapi Plugin SDK](https://docs.strapi.io/dev-docs/plugins/development/create-a-plugin) 
and [Strapi Design System](https://design-system.strapi.io/).
