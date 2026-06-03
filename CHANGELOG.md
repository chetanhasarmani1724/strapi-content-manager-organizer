# Changelog

All notable changes to this project will be documented in this file.


## [1.0.1] - 2026-06-03
### Fixed
- Sidebar groups now always reset to `defaultExpanded` config values on navigation — removed localStorage persistence for expand/collapse state
- Single-item groups now render directly at top level without a collapsible wrapper
- "Other" (ungrouped) group now defaults to collapsed

## [1.0.0] - 2026-05-18

### Added

- 🎉 Initial release
- Organize Content Manager sidebar into collapsible grouped sections
- Admin settings page for configuring groups via JSON editor
- Server-side API for persisting group configuration
- Full Strapi 5 compatibility
- Light and dark theme support with automatic detection
- Drag-and-drop ready architecture
- MIT License

### Technical

- Admin panel built with Strapi Design System v2
- TypeScript throughout (admin + server)
- DOM-based sidebar injection for zero-conflict integration
- `strapi-plugin build` / `verify` compatible

[Unreleased]: https://github.com/chetanhasarmani1724/strapi-content-manager-organizer/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/chetanhasarmani1724/strapi-content-manager-organizer/releases/tag/v1.0.0
