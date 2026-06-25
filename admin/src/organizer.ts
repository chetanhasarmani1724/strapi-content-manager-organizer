import { fetchMenuConfig } from './api';
import { DEFAULT_MENU_CONFIG } from './menu-config';
import type { MenuGroup, MenuOrganizerConfig } from './types';

const STORAGE_KEY = 'cmo-state';
const STYLE_ID = 'cmo-styles';
const MARKER_ATTR = 'data-cmo-organized';
const CONFIG_EVENT = 'cmo:config-updated';

// Group BOTH collection types AND single types (both sidebar lists),
// including plugin content types (e.g. users-permissions.user), which end up "ungrouped" at the bottom.
const CONTENT_LINK_SELECTOR =
  'a[href*="/content-manager/collection-types/"], a[href*="/content-manager/single-types/"]';

let menuConfig: MenuOrganizerConfig = DEFAULT_MENU_CONFIG;
let currentTheme: 'light' | 'dark' | null = null;
let themeObserver: MutationObserver | null = null;
let themeTimer: ReturnType<typeof setTimeout> | null = null;

const THEMES = {
  light: {
    '--mo-neutral0': '#ffffff',
    '--mo-neutral100': '#f6f6f9',
    '--mo-neutral150': '#eaeaef',
    '--mo-neutral500': '#8e8ea9',
    '--mo-neutral600': '#666687',
    '--mo-neutral800': '#32324d',
    '--mo-primary100': '#f0f0ff',
    '--mo-primary700': '#4945ff',
  },
  dark: {
    '--mo-neutral0': '#181826',
    '--mo-neutral100': '#212134',
    '--mo-neutral150': '#32324d',
    '--mo-neutral500': '#8e8ea9',
    '--mo-neutral600': '#a5a5ba',
    '--mo-neutral800': '#ffffff',
    '--mo-primary100': '#32324d',
    '--mo-primary700': '#7b79ff',
  },
} as const;

function detectTheme(): 'light' | 'dark' {
  try {
    try {
      const strapiTheme = localStorage.getItem('STRAPI_THEME');
      if (strapiTheme === 'light' || strapiTheme === 'dark') return strapiTheme;
    } catch { }

    const body = document.body;
    if (body) {
      const bg = getComputedStyle(body).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const match = bg.match(/\d+/g);
        if (match && match.length >= 3) {
          const [r, g, b] = match.map(Number);
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          return luminance > 128 ? 'light' : 'dark';
        }
      }
    }

    const dataTheme = document.documentElement.getAttribute('data-theme');
    if (dataTheme === 'light' || dataTheme === 'dark') return dataTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyThemeVars(force = false) {
  const theme = detectTheme();
  if (!force && theme === currentTheme) return;

  currentTheme = theme;
  document.documentElement.setAttribute('data-mo-theme', theme);

  for (const [prop, value] of Object.entries(THEMES[theme])) {
    document.documentElement.style.setProperty(prop, value);
  }
}

function scheduleThemeSync() {
  if (themeTimer) clearTimeout(themeTimer);
  themeTimer = setTimeout(() => {
    requestAnimationFrame(() => {
      currentTheme = null;
      applyThemeVars(true);
    });
  }, 100);
}

function setupThemeSync() {
  applyThemeVars(true);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    currentTheme = null;
    applyThemeVars(true);
  });

  if (!themeObserver) {
    themeObserver = new MutationObserver(() => scheduleThemeSync());
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class', 'data-theme'],
    });

    if (document.body) {
      themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['style', 'class', 'data-theme'],
      });
    }
  }

  if (!(window as any).__moStoragePatched) {
    const setItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key: string, value: string) {
      setItem(key, value);
      if (key.includes('THEME') || key.includes('theme')) {
        setTimeout(() => {
          currentTheme = null;
          applyThemeVars(true);
        }, 300);
      }
    };
    (window as any).__moStoragePatched = true;
  }

  if (!(window as any).__moThemeFetchPatched) {
    const currentFetch = window.fetch;
    window.fetch = async function (...args) {
      const response = await currentFetch.apply(this, args);
      try {
        const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
        if (url.includes('/users/me') || url.includes('/auth/local')) {
          const method = (typeof args[1] === 'object' ? args[1]?.method : '') || '';
          if (method.toUpperCase() === 'PUT' || method.toUpperCase() === 'POST' || url.includes('/users/me')) {
            setTimeout(() => { currentTheme = null; applyThemeVars(true); }, 500);
            setTimeout(() => { currentTheme = null; applyThemeVars(true); }, 1500);
          }
        }
      } catch { }
      return response;
    };
    (window as any).__moThemeFetchPatched = true;
  }
}

function loadGroupState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveGroupState(state: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { }
}

function stripPrefix(text: string): string {
  return text.replace(/^\d{1,3}\s+/, '');
}

function extractSingularName(href: string): string | null {
  const match = href.match(/(?:api|plugin)::([^.]+)\./);
  return match ? match[1] : null;
}

function findGroup(singularName: string): MenuGroup | null {
  for (const group of menuConfig.groups) {
    if (group.items.includes(singularName)) return group;
  }
  return null;
}

// Group label without leading emoji/symbols, used for alphabetical sorting.
function cleanLabel(label: string): string {
  return label.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .mo-group {
      width: 100%;
    }

    .mo-header {
      cursor: pointer;
      width: 100%;
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      gap: 6px;
      border-radius: 4px;
      padding: 6px 8px;
      text-align: left;
    }

    .mo-header:hover {
      background-color: var(--mo-neutral100);
    }

    .mo-chevron {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      color: var(--mo-neutral500);
    }

    .mo-group.mo-collapsed .mo-chevron {
      transform: rotate(-90deg);
    }

    .mo-label {
      flex: 1 1 auto;
      min-width: 0;
      text-align: left;
      font-weight: 600;
      font-size: 1.2rem;
      line-height: 1.2;
      color: var(--mo-neutral800);
    }

    .mo-badge {
      flex-shrink: 0;
      margin-left: 8px;
      padding: 0 8px;
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 2rem;
      border-radius: 4px;
      background-color: var(--mo-neutral150);
      color: var(--mo-neutral600);
    }

    .mo-items {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: stretch;
      overflow: hidden;
      transition: max-height 0.5s cubic-bezier(0, 1, 0, 1);
    }

    .mo-group.mo-collapsed .mo-items {
      max-height: 0 !important;
    }
 
    .mo-items > li > a > div {
      padding-left: 36px !important;
    }

    html[data-mo-theme="light"] .mo-header:hover {
      background-color: var(--mo-neutral100);
    }

    /* Hide ungrouped sidebar links instantly — revealed only inside .mo-group or as direct items.
       Only api:: links (content types) are hidden, so other links (e.g. plugin::) stay visible.
       Disabled while searching (html[data-mo-searching]) so search results are not hidden. */
    html:not([data-mo-searching]) ol:has(a[href*="/content-manager/collection-types/api::"]) > li:has(a[href*="/api::"]):not(:has(.mo-group)):not([data-mo-direct]),
    html:not([data-mo-searching]) ol:has(a[href*="/content-manager/single-types/api::"]) > li:has(a[href*="/api::"]):not(:has(.mo-group)):not([data-mo-direct]) {
      opacity: 0;
      height: 0;
      overflow: hidden;
      pointer-events: none;
    }

    /* Reveal links once they are inside organized groups */
    .mo-items > li {
      opacity: 1 !important;
      height: auto !important;
      overflow: visible !important;
      pointer-events: auto !important;
    }

    /* Reveal single-item groups rendered directly */
    li[data-mo-direct] {
      opacity: 1 !important;
      height: auto !important;
      overflow: visible !important;
      pointer-events: auto !important;
    }
  `;

  document.head.appendChild(style);
}

function chevronSvg(): string {
  return '<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 .889a.86.86 0 0 1-.26.625l-6 5.778a.92.92 0 0 1-.65.264.92.92 0 0 1-.65-.264l-6-5.778A.86.86 0 0 1 .18.89c0-.24.1-.451.26-.625A.92.92 0 0 1 1.09 0a.92.92 0 0 1 .65.264L7.09 5.42 12.44.264A.92.92 0 0 1 13.09 0a.92.92 0 0 1 .65.264.86.86 0 0 1 .26.625Z" fill="currentColor"/></svg>';
}

interface LinkItem {
  li: HTMLElement;
  link: HTMLAnchorElement;
  singularName: string;
}

// Displayed name of the content type (used to sort items alphabetically).
function displayText(item: LinkItem): string {
  return (item.link.textContent || item.singularName).replace(/\s+/g, ' ').trim();
}

// Returns every sidebar <ol> list that contains content types
// (both the Collection Types and the Single Types sections).
function findContentTypeOls(): HTMLElement[] {
  const links = document.querySelectorAll(CONTENT_LINK_SELECTOR);
  const ols = new Set<HTMLElement>();
  links.forEach((a) => {
    const ol = (a as HTMLElement).closest('ol');
    if (ol) ols.add(ol as HTMLElement);
  });
  return Array.from(ols);
}

function stripNumericPrefixes(items: LinkItem[]) {
  if (!menuConfig.stripNumericPrefix) return;

  for (const item of items) {
    const walker = document.createTreeWalker(
      item.link,
      NodeFilter.SHOW_TEXT,
      null
    );
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      const text = node.nodeValue || '';
      if (/^\d{1,3}\s+\S/.test(text.trim())) {
        node.nodeValue = stripPrefix(text.trim());
      }
    }
  }
}



function restoreMenu(ol: HTMLElement) {
  const organizedItems = Array.from(ol.querySelectorAll('.mo-items > li')) as HTMLElement[];
  const directItems = Array.from(ol.querySelectorAll(':scope > li[data-mo-direct]')) as HTMLElement[];

  if (organizedItems.length === 0 && directItems.length === 0) return;

  while (ol.firstChild) {
    ol.removeChild(ol.firstChild);
  }

  for (const item of directItems) {
    item.removeAttribute('data-mo-direct');
    ol.appendChild(item);
  }
  for (const item of organizedItems) {
    ol.appendChild(item);
  }

  ol.removeAttribute(MARKER_ATTR);
}

function reorganizeMenu(force = false) {
  if (!configLoaded) return; // never group with the (empty) default config
  for (const ol of findContentTypeOls()) {
    reorganizeOl(ol, force);
  }
}

function reorganizeOl(ol: HTMLElement, force = false) {
  if (force) {
    restoreMenu(ol);
    // restoreMenu returns early (and does NOT clear the marker) if Strapi has already
    // re-rendered the flat list, so we always remove it to force a regroup.
    ol.removeAttribute(MARKER_ATTR);
  }

  if (ol.getAttribute(MARKER_ATTR)) return;

  const items: LinkItem[] = [];
  ol.querySelectorAll(':scope > li').forEach((li) => {
    const link = li.querySelector(CONTENT_LINK_SELECTOR) as HTMLAnchorElement;
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const singularName = extractSingularName(href);
    if (!singularName) return;

    items.push({ li: li as HTMLElement, link, singularName });
  });

  if (items.length === 0) return;

  ol.setAttribute(MARKER_ATTR, 'true');

  stripNumericPrefixes(items);

  const grouped = new Map<string, { group: MenuGroup; items: LinkItem[] }>();
  const ungrouped: LinkItem[] = [];

  for (const group of menuConfig.groups) {
    grouped.set(group.id, { group, items: [] });
  }

  for (const item of items) {
    const group = findGroup(item.singularName);
    if (group) {
      grouped.get(group.id)!.items.push(item);
    } else {
      ungrouped.push(item);
    }
  }

  // Sort items inside each group alphabetically, by their DISPLAYED name.
  for (const [, entry] of grouped) {
    entry.items.sort((a, b) => displayText(a).localeCompare(displayText(b), undefined, { sensitivity: 'base' }));
  }
  ungrouped.sort((a, b) => displayText(a).localeCompare(displayText(b), undefined, { sensitivity: 'base' }));

  for (const item of items) {
    item.li.remove();
  }

  while (ol.firstChild) {
    ol.removeChild(ol.firstChild);
  }

  function buildGroup(
    groupId: string,
    label: string,
    groupItems: LinkItem[],
    defaultExpanded: boolean
  ): HTMLElement {
     const isExpanded = defaultExpanded;

    const wrapperLi = document.createElement('li');
    wrapperLi.style.listStyle = 'none';

    const groupEl = document.createElement('div');
    groupEl.className = `mo-group${isExpanded ? '' : ' mo-collapsed'}`;
    groupEl.setAttribute('data-mo-group', groupId);

    const header = document.createElement('button');
    header.className = 'mo-header';
    header.type = 'button';
    header.setAttribute('aria-expanded', String(isExpanded));

    const chevronSpan = document.createElement('span');
    chevronSpan.className = 'mo-chevron';
    chevronSpan.setAttribute('aria-hidden', 'true');
    chevronSpan.innerHTML = chevronSvg();
    header.appendChild(chevronSpan);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'mo-label';
    labelSpan.textContent = label;
    header.appendChild(labelSpan);

    const badge = document.createElement('span');
    badge.className = 'mo-badge';
    badge.textContent = String(groupItems.length);
    header.appendChild(badge);

    header.addEventListener('click', () => {
      const collapsed = groupEl.classList.toggle('mo-collapsed');
      header.setAttribute('aria-expanded', String(!collapsed));
    });

    groupEl.appendChild(header);

    const itemsContainer = document.createElement('ul');
    itemsContainer.className = 'mo-items';
    itemsContainer.style.maxHeight = isExpanded
      ? `${groupItems.length * 40}px`
      : '0';

    for (const item of groupItems) {
      itemsContainer.appendChild(item.li);
    }

    const updateHeight = () => {
      if (!groupEl.classList.contains('mo-collapsed')) {
        itemsContainer.style.maxHeight = `${itemsContainer.scrollHeight}px`;
      }
    };

    header.addEventListener('click', () => {
      requestAnimationFrame(updateHeight);
    });

    groupEl.appendChild(itemsContainer);
    wrapperLi.appendChild(groupEl);

    requestAnimationFrame(updateHeight);

    return wrapperLi;
  }

  // Groups in alphabetical order by label (ignoring the leading emoji).
  const sortedEntries = [...grouped.values()].sort((a, b) =>
    cleanLabel(a.group.label).localeCompare(cleanLabel(b.group.label), undefined, { sensitivity: 'base' })
  );

  for (const entry of sortedEntries) {
    if (entry.items.length === 0) continue;

    // Idle: single-item groups are rendered as a direct entry (no header).
    // While searching: every matching group shows its header and is EXPANDED.
    if (!searching && entry.items.length === 1) {
      entry.items[0].li.setAttribute('data-mo-direct', 'true');
      ol.appendChild(entry.items[0].li);
      continue;
    }

    const expanded = searching ? true : entry.group.defaultExpanded;
    ol.appendChild(buildGroup(entry.group.id, entry.group.label, entry.items, expanded));
  }

  // Content types not assigned to any group (e.g. the users-permissions User):
  // rendered at the bottom as plain entries, after all groups.
  for (const item of ungrouped) {
    item.li.setAttribute('data-mo-direct', 'true');
    ol.appendChild(item.li);
  }


}

let observer: MutationObserver | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let lastUrl = '';
let configLoaded = false;
// True while the user is searching the sidebar. The list is flattened before React
// re-renders (moving its <li> nodes during render corrupts it), then regrouped once it settles.
let searching = false;

function needsReorganization(ol: HTMLElement): boolean {
  // If any direct <li> child does NOT contain a .mo-group and is not a direct-rendered item, the DOM is ungrouped
  const directChildren = ol.querySelectorAll(':scope > li');
  for (const li of directChildren) {
    if (!li.querySelector('.mo-group') && !li.hasAttribute('data-mo-direct')) {
      const link = li.querySelector(CONTENT_LINK_SELECTOR);
      if (link) return true;
    }
  }
  return false;
}

function tryReorganize() {
  if (searching) return;
  if (!configLoaded) return; // don't group before the config is loaded (avoids grouping with an empty config)
  if (!window.location.pathname.includes('/content-manager/')) return;

  for (const ol of findContentTypeOls()) {
    if (needsReorganization(ol)) {
      reorganizeOl(ol, true);
    }
  }
}

let searchTimer: ReturnType<typeof setTimeout> | null = null;

// Regroup after React has filtered/settled the list (while searching: groups EXPANDED).
function scheduleSearchRegroup(delay = 160) {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    reorganizeMenu(true);
    if (!searching) {
      // when idle, re-enable the hide rule only after regrouping
      document.documentElement.removeAttribute('data-mo-searching');
    }
  }, delay);
}

function isSidebarSearchInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLInputElement)) return false;
  let el: HTMLElement | null = target.parentElement;
  for (let i = 0; i < 8 && el; i++, el = el.parentElement) {
    if (el.querySelector?.(CONTENT_LINK_SELECTOR)) return true;
  }
  return false;
}

function handleSearchInput(event: Event) {
  const target = event.target;
  if (!isSidebarSearchInput(target)) return;

  // Capture phase: flatten the list BEFORE React re-renders the filter, so React
  // reconciles against a flat DOM (moving its <li> nodes during render corrupts it).
  for (const ol of findContentTypeOls()) {
    restoreMenu(ol);
    ol.removeAttribute(MARKER_ATTR);
  }

  searching = (target as HTMLInputElement).value.trim().length > 0;
  if (searching) {
    document.documentElement.setAttribute('data-mo-searching', 'true');
  }
  // Once typing stops, regroup (groups stay expanded while searching).
  scheduleSearchRegroup();
}

function isContentManagerPage() {
  return window.location.pathname.includes('/content-manager/');
}

async function refreshConfig(force = false) {
  if (!force && !isContentManagerPage()) return;

  menuConfig = await fetchMenuConfig();
  configLoaded = true;

  if (force) {
    // Config changed from the settings UI: regroup immediately with the new config.
    reorganizeMenu(true);
    return;
  }

  // First load: the nav may not be rendered yet.
  // Retry a few times until there is something to group (avoids the "needs a refresh" issue).
  scheduleRetry(50);
  setTimeout(() => scheduleRetry(0), 300);
  setTimeout(() => scheduleRetry(0), 900);
  setTimeout(() => scheduleRetry(0), 1800);
}

function scheduleRetry(delay = 30) {
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = setTimeout(() => tryReorganize(), delay);
}

function handleNavigation() {
  const url = window.location.pathname;
  if (url === lastUrl) return;
  lastUrl = url;

  if (!configLoaded && isContentManagerPage()) {
    refreshConfig();
    return;
  }

  scheduleRetry(30);
}

export function setupMenuOrganizer() {
  setupThemeSync();
  injectStyles();
  refreshConfig();

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    handleNavigation();
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    handleNavigation();
  };

  window.addEventListener('popstate', () => handleNavigation());
  window.addEventListener(CONFIG_EVENT, () => {
    refreshConfig(true);
  });

  // Handle the sidebar search input: flatten + regroup so search works with groups.
  document.addEventListener('input', handleSearchInput, true);

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) continue;

      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;

        if (
          node.querySelector?.(CONTENT_LINK_SELECTOR) ||
          (node instanceof HTMLAnchorElement &&
            (node.href?.includes('/content-manager/collection-types/api::') ||
              node.href?.includes('/content-manager/single-types/api::')))
        ) {
          scheduleRetry(30);
          return;
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  scheduleRetry(100);
}
