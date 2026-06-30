import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Main } from '@strapi/design-system';
import { useNotification, Page as PageHelper } from '@strapi/admin/strapi-admin';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { Drag } from '@strapi/icons';

import { fetchMenuConfig, fetchMenuContentTypes, saveMenuConfig } from '../../api';
import type { MenuContentTypeOption, MenuGroup, MenuOrganizerConfig } from '../../types';

import { Header } from './Header';
import { TabsAndStats } from './TabsAndStats';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { GroupModal } from './GroupModal';
import { ContentLayout, ErrorBanner, DragOverlayCard } from './styles';

const eventName = 'cmo:config-updated';

function createGroupId(label: string, groups: MenuGroup[]) {
  const base = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'group';
  const existing = new Set(groups.map((g) => g.id));
  let id = base;
  let i = 2;
  while (existing.has(id)) { id = `${base}-${i}`; i++; }
  return id;
}

function cleanConfig(config: MenuOrganizerConfig): MenuOrganizerConfig {
  const seen = new Set<string>();
  return {
    stripNumericPrefix: config.stripNumericPrefix,
    sortBy: config.sortBy,
    groups: config.groups.map((g) => ({
      ...g,
      label: g.label.trim() || 'Group',
      items: g.items.filter((item) => {
        if (seen.has(item)) return false;
        seen.add(item);
        return true;
      }),
    })),
  };
}

export default function SettingsPage() {
  const [config, setConfig] = useState<MenuOrganizerConfig | null>(null);
  const [contentTypes, setContentTypes] = useState<MenuContentTypeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'collectionType' | 'singleType'>('collectionType');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'rename'>('create');
  const [modalGroupName, setModalGroupName] = useState('');
  const [modalExpanded, setModalExpanded] = useState(false);
  const [renameGroupId, setRenameGroupId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const { toggleNotification } = useNotification();
  const savedConfigRef = useRef<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchMenuConfig(), fetchMenuContentTypes()])
      .then(([nextConfig, nextCts]) => {
        if (!mounted) return;
        const cleaned = cleanConfig(nextConfig);
        cleaned.groups = cleaned.groups.map(g => {
          if (g.items.length === 0) {
            return { ...g, kind: g.kind || 'collectionType' };
          }
          const itemKinds = g.items
            .map(item => nextCts.find(ct => ct.singularName === item)?.kind)
            .filter(Boolean);
          if (itemKinds.length > 0) {
            const allSingle = itemKinds.every(k => k === 'singleType');
            const allCollection = itemKinds.every(k => k === 'collectionType');
            if (allSingle) return { ...g, kind: 'singleType' as const };
            if (allCollection) return { ...g, kind: 'collectionType' as const };
          }
          return { ...g, kind: g.kind || 'collectionType' };
        });

        setConfig(cleaned);
        savedConfigRef.current = JSON.stringify(cleaned);
        setContentTypes(nextCts);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || 'Unable to load settings');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const assignedMap = useMemo(() => {
    const map = new Map<string, string>();
    config?.groups.forEach((g) => g.items.forEach((item) => map.set(item, g.label)));
    return map;
  }, [config]);

  const filteredContentTypes = useMemo(() => {
    let items = contentTypes.filter((ct) => ct.kind === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((ct) => ct.cleanDisplayName.toLowerCase().includes(q));
    }
    return items;
  }, [contentTypes, activeTab, search]);

  const hasChanges = useMemo(
    () => config !== null && JSON.stringify(config) !== savedConfigRef.current,
    [config],
  );

  const stats = useMemo(() => {
    const tabCts = contentTypes.filter(c => c.kind === activeTab);
    const total = tabCts.length;
    let grouped = 0;
    tabCts.forEach(ct => {
      if (assignedMap.has(ct.singularName)) grouped++;
    });
    return { total, grouped, ungrouped: total - grouped };
  }, [contentTypes, assignedMap, activeTab]);

  const updateConfig = useCallback((updater: (c: MenuOrganizerConfig) => MenuOrganizerConfig) => {
    setConfig((c) => (c ? updater(c) : c));
  }, []);

  const removeItemFromGroup = useCallback((groupId: string, itemIndex: number) => {
    updateConfig((c) => ({
      ...c,
      groups: c.groups.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.filter((_, j) => j !== itemIndex) }
          : g
      ),
    }));
  }, [updateConfig]);

  const deleteGroup = useCallback((groupId: string) => {
    updateConfig((c) => ({
      ...c,
      groups: c.groups.filter((g) => g.id !== groupId)
    }));
  }, [updateConfig]);

  const openCreateModal = () => {
    setModalMode('create');
    setModalGroupName('');
    setModalExpanded(false);
    setModalOpen(true);
  };

  const openRenameModal = (groupId: string) => {
    if (!config) return;
    const group = config.groups.find(g => g.id === groupId);
    if (!group) return;

    setModalMode('rename');
    setRenameGroupId(groupId);
    setModalGroupName(group.label);
    setModalExpanded(group.defaultExpanded);
    setModalOpen(true);
  };

  const handleModalSubmit = () => {
    if (!modalGroupName.trim()) return;
    if (modalMode === 'create') {
      updateConfig((c) => ({
        ...c,
        groups: [
          ...c.groups,
          {
            id: createGroupId(modalGroupName, c.groups),
            label: modalGroupName.trim(),
            defaultExpanded: modalExpanded,
            kind: activeTab,
            items: [],
          },
        ],
      }));
    } else {
      updateConfig((c) => ({
        ...c,
        groups: c.groups.map((g) =>
          g.id === renameGroupId
            ? { ...g, label: modalGroupName.trim(), defaultExpanded: modalExpanded }
            : g
        ),
      }));
    }
    setModalOpen(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || !config) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith('group-') && overId.startsWith('group-')) {
      const oldIndex = config.groups.findIndex((g) => `group-${g.id}` === activeId);
      const newIndex = config.groups.findIndex((g) => `group-${g.id}` === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        updateConfig((c) => ({ ...c, groups: arrayMove(c.groups, oldIndex, newIndex) }));
      }
      return;
    }

    if (activeId.startsWith('available-')) {
      const singularName = activeId.replace('available-', '');
      if (assignedMap.has(singularName)) return;

      let targetGroupId: string | null = null;
      if (overId.startsWith('group-')) {
        targetGroupId = overId.replace('group-', '');
      } else {
        for (const g of config.groups) {
          if (g.items.includes(overId)) { targetGroupId = g.id; break; }
        }
      }

      if (!targetGroupId) return;

      const targetGroup = config.groups.find(g => g.id === targetGroupId);
      const itemKind = contentTypes.find(ct => ct.singularName === singularName)?.kind || 'collectionType';
      const groupKind = targetGroup?.kind || 'collectionType';

      if (itemKind !== groupKind) return;

      updateConfig((c) => ({
        ...c,
        groups: c.groups.map((g) =>
          g.id === targetGroupId && !g.items.includes(singularName)
            ? { ...g, items: [...g.items, singularName] }
            : g,
        ),
      }));

      toggleNotification({
        type: 'success',
        title: 'Success',
        message: `Successfully added to ${targetGroup?.label}`
      });

      return;
    }

    let sourceGroupIdx = -1;
    let sourceItemIdx = -1;
    for (let gi = 0; gi < config.groups.length; gi++) {
      const ii = config.groups[gi].items.indexOf(activeId);
      if (ii !== -1) { sourceGroupIdx = gi; sourceItemIdx = ii; break; }
    }
    if (sourceGroupIdx === -1) return;

    let targetGroupIdx = -1;
    let targetItemIdx = -1;

    if (overId.startsWith('group-')) {
      targetGroupIdx = config.groups.findIndex((g) => `group-${g.id}` === overId);
      targetItemIdx = targetGroupIdx !== -1 ? config.groups[targetGroupIdx].items.length : -1;
    } else {
      for (let gi = 0; gi < config.groups.length; gi++) {
        const ii = config.groups[gi].items.indexOf(overId);
        if (ii !== -1) { targetGroupIdx = gi; targetItemIdx = ii; break; }
      }
    }
    if (targetGroupIdx === -1) return;

    const sourceKind = config.groups[sourceGroupIdx].kind || 'collectionType';
    const targetKind = config.groups[targetGroupIdx].kind || 'collectionType';
    if (sourceKind !== targetKind) return;

    if (sourceGroupIdx === targetGroupIdx) {
      updateConfig((c) => ({
        ...c,
        groups: c.groups.map((g, i) =>
          i === sourceGroupIdx ? { ...g, items: arrayMove(g.items, sourceItemIdx, targetItemIdx) } : g,
        ),
      }));
    } else {
      updateConfig((c) => {
        const newGroups = c.groups.map((g) => ({ ...g, items: [...g.items] }));
        const [moved] = newGroups[sourceGroupIdx].items.splice(sourceItemIdx, 1);
        newGroups[targetGroupIdx].items.splice(targetItemIdx, 0, moved);
        return { ...c, groups: newGroups };
      });
    }
  };

  const save = async () => {
    if (!config) return;
    setSaving(true);
    setError('');
    try {
      const saved = await saveMenuConfig(cleanConfig(config));
      setConfig(saved);
      savedConfigRef.current = JSON.stringify(saved);
      window.dispatchEvent(new CustomEvent(eventName, { detail: saved }));
      toggleNotification({ type: 'success', title: 'Saved', message: 'Configuration saved successfully' });
    } catch (err: any) {
      const message = err?.message || 'Unable to save settings';
      setError(message);
      toggleNotification({ type: 'danger', title: 'Error', message });
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    if (savedConfigRef.current) setConfig(JSON.parse(savedConfigRef.current));
  };

  const getLabel = useCallback(
    (singularName: string) => {
      const ct = contentTypes.find((c) => c.singularName === singularName);
      return ct?.cleanDisplayName || singularName;
    },
    [contentTypes],
  );

  const getKind = useCallback(
    (singularName: string) => {
      const ct = contentTypes.find((c) => c.singularName === singularName);
      return ct?.kind || 'collectionType';
    },
    [contentTypes],
  );

  if (loading) return <Main><PageHelper.Loading /></Main>;
  if (!config) return <Main><PageHelper.Error /></Main>;

  const activeDragLabel = activeDragId
    ? activeDragId.startsWith('available-')
      ? getLabel(activeDragId.replace('available-', ''))
      : activeDragId.startsWith('group-')
        ? config.groups.find((g) => `group-${g.id}` === activeDragId)?.label || ''
        : getLabel(activeDragId)
    : '';

  const visibleGroups = config.groups.filter(g => (g.kind || 'collectionType') === activeTab);

  return (
    <Main>
      <Header 
        hasChanges={hasChanges} 
        saving={saving} 
        onReset={reset} 
        onSave={save} 
      />

      <TabsAndStats 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sortBy={config.sortBy || 'alphabetical'}
        onChangeSortBy={(sortBy) => updateConfig(c => ({ ...c, sortBy }))}
        stats={stats} 
      />

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ContentLayout>
          <LeftPanel
            activeTab={activeTab}
            search={search}
            setSearch={setSearch}
            filteredContentTypes={filteredContentTypes}
            assignedMap={assignedMap}
          />
          <RightPanel
            groups={visibleGroups}
            activeTab={activeTab}
            getLabel={getLabel}
            getKind={getKind}
            onNewGroup={openCreateModal}
            onRemoveItem={removeItemFromGroup}
            onDeleteGroup={deleteGroup}
            onRenameGroup={openRenameModal}
          />
        </ContentLayout>

        <DragOverlay dropAnimation={null}>
          {activeDragId && (
            <DragOverlayCard>
              <Drag /> {activeDragLabel}
            </DragOverlayCard>
          )}
        </DragOverlay>
      </DndContext>

      <GroupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        groupName={modalGroupName}
        setGroupName={setModalGroupName}
        expanded={modalExpanded}
        setExpanded={setModalExpanded}
        onSubmit={handleModalSubmit}
      />
    </Main>
  );
}
