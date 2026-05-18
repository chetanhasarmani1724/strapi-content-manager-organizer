# Contributing to Content Manager Organizer

First off, **thank you** for considering contributing to Content Manager Organizer! 🎉  
Every contribution — whether it's a bug report, feature request, documentation improvement, or code change — makes this plugin better for the entire Strapi community.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#-reporting-bugs)
  - [Suggesting Features](#-suggesting-features)
  - [Your First Code Contribution](#-your-first-code-contribution)
  - [Pull Requests](#-pull-requests)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Coding Guidelines](#-coding-guidelines)
- [Commit Message Convention](#-commit-message-convention)
- [Release Process](#-release-process)

---

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to github issue.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report, please **search existing issues** to avoid duplicates.

When filing a bug, include:

| Field | Details |
|-------|---------|
| **Strapi version** | e.g., `5.46.0` |
| **Plugin version** | e.g., `1.0.0` |
| **Node.js version** | e.g., `20.11.0` |
| **Database** | SQLite / PostgreSQL / MySQL |
| **OS** | Windows / macOS / Linux |
| **Steps to reproduce** | Numbered step-by-step instructions |
| **Expected behavior** | What you expected to happen |
| **Actual behavior** | What actually happened |
| **Screenshots** | If applicable |

👉 [Open a Bug Report](https://github.com/chetanhasarmani1724/strapi-content-manager-organizer/issues/new?template=bug_report.yml)

### 💡 Suggesting Features

We love feature ideas! Before suggesting:
1. Check the [Roadmap](https://github.com/chetanhasarmani1724/strapi-content-manager-organizer#roadmap--good-first-issues) for planned features
2. Search [existing feature requests](https://github.com/chetanhasarmani1724/strapi-content-manager-organizer/issues?q=is%3Aissue+label%3Aenhancement)

👉 [Open a Feature Request](https://github.com/chetanhasarmani1724/strapi-content-manager-organizer/issues/new?template=feature_request.yml)

### 🔰 Your First Code Contribution

Look for issues labeled:
- [`good first issue`](https://github.com/chetanhasarmani1724/strapi-content-manager-organizer/labels/good%20first%20issue) — Simple, well-scoped tasks
- [`help wanted`](https://github.com/chetanhasarmani1724/strapi-content-manager-organizer/labels/help%20wanted) — Issues where we'd appreciate community help

### 🔀 Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`: `git checkout -b feat/my-feature`
3. **Make your changes** following our [Coding Guidelines](#-coding-guidelines)
4. **Test thoroughly** — ensure existing functionality isn't broken
5. **Commit** using our [commit convention](#-commit-message-convention)
6. **Push** to your fork: `git push origin feat/my-feature`
7. **Open a Pull Request** against `main`

Every PR should:
- ✅ Have a clear title and description
- ✅ Reference related issues (e.g., `Closes #42`)
- ✅ Pass all CI checks
- ✅ Include relevant tests (if applicable)
- ✅ Update documentation if behavior changes

---

## 🛠 Development Setup

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn/pnpm)
- A **Strapi 5** project for testing

### Quick Start

```bash
# 1. Fork & clone the repository
git clone https://github.com/<your-username>/strapi-content-manager-organizer.git
cd strapi-content-manager-organizer

# 2. Install root dependencies (Strapi dev project)
npm install

# 3. Install plugin dependencies
cd src/plugins/content-manager-organizer
npm install

# 4. Start the plugin in watch mode (rebuilds on changes)
npm run watch

# 5. In a separate terminal — start Strapi
cd ../../..  # back to project root
npm run develop
```

### Verifying Your Build

```bash
cd src/plugins/content-manager-organizer

# Build the plugin
npm run build

# Verify the package structure
npm run verify
```

---

## 📁 Project Structure

```
strapi-content-manager-organizer/
├── config/                    # Strapi project config (dev only)
├── src/
│   └── plugins/
│       └── content-manager-organizer/    # ← THE PLUGIN
│           ├── admin/                    # Admin panel (React)
│           │   └── src/
│           │       ├── components/       # UI components
│           │       ├── pages/            # Settings page
│           │       └── index.ts          # Plugin registration
│           ├── server/                   # Server-side (Node.js)
│           │   └── src/
│           │       ├── controllers/      # API controllers
│           │       ├── routes/           # API routes
│           │       ├── services/         # Business logic
│           │       └── content-types/    # DB schema
│           ├── dist/                     # Built output (npm)
│           ├── package.json              # Plugin package
│           ├── strapi-admin.js           # Admin entry
│           └── strapi-server.js          # Server entry
├── package.json               # Strapi dev project package
└── README.md                  # Project README
```

---

## 📐 Coding Guidelines

### TypeScript

- Use **TypeScript** for all new code
- Enable **strict mode** — avoid `any` types where possible
- Export types/interfaces that other files consume

### React (Admin Panel)

- Use **functional components** with hooks
- Use the **Strapi Design System v2** (`@strapi/design-system`) for all UI
- Use `@strapi/icons` for iconography — no external icon libraries
- Follow the existing component patterns in `admin/src/components/`

### Server-Side

- Follow Strapi's **controller → service** pattern
- Use `strapi.db.query()` for database operations
- Validate inputs in controllers before passing to services

### General

- **No `console.log`** in production code — use Strapi's logger
- Keep files focused — one component/service per file
- Use meaningful variable names — no single-letter variables (except iterators)
- Add JSDoc comments for public functions

---

## 📝 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, dependencies |
| `ci` | CI/CD configuration |

### Scopes

| Scope | Description |
|-------|-------------|
| `admin` | Admin panel (React) |
| `server` | Server-side (Node.js) |
| `config` | Plugin/project configuration |
| `deps` | Dependency updates |

### Examples

```
feat(admin): add drag-and-drop reordering for groups
fix(server): handle empty config on first boot
docs: update installation instructions for pnpm
chore(deps): bump @strapi/sdk-plugin to 5.1.0
```

---

## 🚀 Release Process

> Releases are managed by the maintainers.

1. Update version in `src/plugins/content-manager-organizer/package.json`
2. Update `CHANGELOG.md`
3. Commit: `chore: release v1.x.x`
4. Tag: `git tag v1.x.x`
5. Push: `git push origin main --tags`
6. GitHub Actions publishes to npm automatically

---

## 💬 Questions?

- 💬 [Open a Discussion](https://github.com/chetanhasarmani1724/strapi-content-manager-organizer/discussions)
- 🐛 [File an Issue](https://github.com/chetanhasarmani1724/strapi-content-manager-organizer/issues)

**Thank you for helping make Content Manager Organizer better!** 🙌
